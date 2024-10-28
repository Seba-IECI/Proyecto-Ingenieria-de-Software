"use strict";
import { EntitySchema } from "typeorm";
import User from "./user.entity.js";

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
        fechaLimite: {
            type: "timestamp",
            nullable: true,
        },
        updatedAt: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            nullable: false,
        },
    },
    relations: {
        alumno: {
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

export default DocumentosPracticaSchema;
