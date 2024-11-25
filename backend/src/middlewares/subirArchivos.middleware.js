import fs from "fs";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../config/configDb.js";
import DocumentosPractica from "../entity/documentosPractica.entity.js";
import PeriodoPractica from "../entity/periodoPractica.entity.js";
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";


const uploadDir = "./src/upload/";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = `${uuidv4()}-${file.originalname.replace(/\s+/g, "-")}`;
        cb(null, uniqueName);
    }
});

const isValidPdf = (filePath) => {
    const pdfSignature = Buffer.from([0x25, 0x50, 0x44, 0x46]);
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.slice(0, 4).equals(pdfSignature);
};

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten archivos .pdf"), false);
    }
};

const verificarPeriodoActivo = async (req, res, next) => {
    try {
        const periodoRepository = AppDataSource.getRepository(PeriodoPractica);
        const fechaActual = new Date();

        const periodoActivo = await periodoRepository.findOne({
            where: {
                habilitado: true,
                fechaInicio: LessThanOrEqual(fechaActual),
                fechaFin: MoreThanOrEqual(fechaActual),
            },
        });

        if (!periodoActivo) {
            return res.status(403).json({ message: "No se puede realizar esta acción fuera del período habilitado." });
        }

        req.periodoPracticaId = periodoActivo.id;
        next();
    } catch (error) {
        console.error("Error al verificar período activo:", error);
        return res.status(500).json({ message: "Error al verificar período activo." });
    }
};

const verificarDocumentoMiddleware = async (req, res, next) => {
    const documentoId = req.params.id;
    const user = req.user;

    try {
        const documentoRepository = AppDataSource.getRepository(DocumentosPractica);
        const documento = await documentoRepository.findOne({
            where: [
                { id: documentoId, alumnoId: user.id },
                { id: documentoId, encargadoPracticasId: user.id }
            ]
        });
        if (!documento) {
            return res.status(404).json({ message: "Documento no encontrado o permisos insuficientes" });
        }
        next();
    } catch (error) {
        console.error("Error al verificar documento:", error);
        return res.status(500).json({ message: "Error al verificar documento" });
    }
};

const handleFileUpload = (req, res, next) => {
    const upload = multer({
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: fileFilter
    }).single("archivo");
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "El tamaño del archivo excede el límite de 5 MB" });
        }
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (req.file && !isValidPdf(req.file.path)) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "El archivo no es un PDF válido." });
        }
        if (req.file) {
            req.file.path = `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`;
        }
        console.log("Archivo subido:", req.file.path);
        next();
    });
};

const uploadMiddleware = async (req, res, next) => {
    if (req.method === "PUT" && req.path.includes("modificarDocumento")) {
        await verificarDocumentoMiddleware(req, res, async (err) => {
            if (err) return res.status(400).json({ message: "Error en la verificación del documento" });
            await verificarPeriodoActivo(req, res, (err) => {
                if (err) return res.status(403).json({ message: err.message });
                handleFileUpload(req, res, next);
            });
        });
    } else if (
        (req.method === "POST" && req.path.includes("subirDocumento"))
        || req.method === "DELETE" && req.path.includes("eliminarDocumento")
    ) {
        await verificarPeriodoActivo(req, res, (err) => {
            if (err) return res.status(403).json(
                { message: "No se puede realizar esta acción fuera del período habilitado" });
            if (req.method === "POST") {
                handleFileUpload(req, res, next);
            } else {
                next();
            }
        });
    } else {
        handleFileUpload(req, res, next);
    }
};

export { uploadMiddleware };
