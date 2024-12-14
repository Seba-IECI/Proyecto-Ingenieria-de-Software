import { startCase } from 'lodash';
import { format as formatRut, validate as validateRut } from "rut.js";
import { format as formatTempo } from "@formkit/tempo";


export function formatUserData(user) {
    return {
        ...user,
        nombreCompleto: startCase(user.nombreCompleto),
        rol: startCase(user.rol),
        rut: formatRut(user.rut),
        createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
    };
}


export function convertirMinusculas(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].toLowerCase();
        }
    }
    return obj;
}


export function formatPostUpdate(user) {
    return {
        nombreCompleto: startCase(user.nombreCompleto),
        rol: startCase(user.rol),
        rut: formatRut(user.rut),
        email: user.email,
        createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
    };
}


export const validations = {
    validateArticuloNombre: (nombre) => {
        if (!nombre) {
            return "El nombre del artículo es obligatorio.";
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
            return "El nombre solo puede contener letras y espacios.";
        }
        if (nombre.length > 20) {
            return "El nombre no puede exceder los 50 caracteres.";
        }
        return null; 
    },
    validateDescripcion: (descripcion) => {
        if (!descripcion) {
            return "La descripción es obligatoria.";
        }
        if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(descripcion)) {
            return "La descripción solo puede contener letras, números y espacios.";
        }
        if (descripcion.length > 50) {
            return "La descripción no puede exceder los 50 caracteres.";
        }
        return null; 
    },
    validateCategoria: (descripcion) => {
        if (!descripcion) {
            return "La categoría es obligatoria.";
        }
        if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(descripcion)) {
            return "La categoría  solo puede contener letras, números y espacios.";
        }
        if (descripcion.length > 50) {
            return "La categoría  no puede exceder los 50 caracteres.";
        }
        return null; 
    },
    
    validateCodigoBarras: (codigo) => {
        if (!codigo) {
            return "El código de barras es obligatorio.";
        }
        if (!/^[a-zA-Z0-9]+$/.test(codigo)) {
            return "El código de barras solo puede contener letras y números.";
        }
        if (codigo.length !== 9) {
            return "El código de barras debe tener exactamente 9 caracteres.";
        }
        return null;
    },
    validateInventarioNombre: (nombre) => {
        if (!nombre) {
            return "El nombre del inventario es obligatorio.";
        }
        if (!/^[a-zA-Z0-9\s]+$/.test(nombre)) {
            return "El nombre del inventario solo puede contener letras, números y espacios.";
        }
        if (nombre.length > 100) {
            return "El nombre del inventario no puede exceder los 100 caracteres.";
        }
        return null;
    },
    validateDiasInventario: (dias) => {
        if (!Number.isInteger(dias)) {
            return "Los días deben ser un número entero.";
        }
        if (dias < 0 || dias > 3) {
            return "Los días deben estar entre 0 y 3.";
        }
        return null;
    },
    validateRut: (rut) => {
        if (!rut) {
            return "El RUT es obligatorio.";
        }
        if (!validateRut(rut)) { 
            return "El RUT no es válido.";
        }
        return null; 
    }
};
