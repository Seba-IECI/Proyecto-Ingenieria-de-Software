import fs from "fs";
import multer from "multer";

const uploadDir = "./src/upload/";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.replace(/\s+/g, "-");
        cb(null, fileName);
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

const uploadMiddleware = (req, res, next) => {
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

        console.log("Archivo subido:", req.file);
        next();
    });
};

export { uploadMiddleware };