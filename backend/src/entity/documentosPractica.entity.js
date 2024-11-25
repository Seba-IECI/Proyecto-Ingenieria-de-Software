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
        encargadoPracticasId: {
            type: "int",
            nullable: true,
        },
        documento: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        especialidad: {
            type: "varchar",
            length: 50,
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
        encargadoPracticas: {
            type: "many-to-one",
            target: User,
            joinColumn: { name: "encargadoPracticasId" },
        },
        periodoPractica: {
            type: "many-to-one",
            target: "PeriodoPractica",
            joinColumn: { name: "periodoPracticaId" },
            nullable: true,
        },
    },
});

export default DocumentosPracticaSchema;
