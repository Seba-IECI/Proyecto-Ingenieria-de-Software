"use strict";
import { EntitySchema } from "typeorm";
import User from "./user.entity.js"; //importante para las relaciones

const DocumentosPracticaSchema = new EntitySchema({
    name: "DocumentosPractica",
    tableName: "documentos_practica",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        alumnoId: {
            type: "int",
            nullable: true,
        },
        profesorId: {
            type: "int",
            nullable: true,
        },
        documento: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        fechaSubida: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        fechaLimite: { //sujeto a cambios, fecha limite solo lo pone el profesor, se puede ocupar para otras cosas
            type: "timestamp",
            nullable: true,
        },
        tipoUsuario: { //sujeto a cambios también, se puede revisar el tipo de usario con solo la id del profesor
            type: "varchar",
            length: 50,
            nullable: false,
        },
        updatedAt: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            nullable: false,
        },
    },
    relations: { //definimos 2 relaciones
        alumno: { //muchos documentos de practica pueden pertenecer a un alumno, puede ser posible cambio
            type: "many-to-one",
            target: User,
            joinColumn: { name: "alumnoId" },
        },
        profesor: {
            type: "many-to-one",
            target: User,
            joinColumn: { name: "profesorId" },
        },
    },
});

//se ocupan las relaciones para conectar los doc de práctica con los usuarios mediante sus ids
//ma eficiente, mantenimiento mas facil, permite obtener documentos y la info del user en una sola consulta

export default DocumentosPracticaSchema;
