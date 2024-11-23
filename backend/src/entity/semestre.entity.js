"use strict";
import { EntitySchema } from "typeorm";

const SemestreSchema = new EntitySchema({
    name: "Semestre",
    tableName: "semestres",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre: {
            type: "varchar",
            length: 50,
            nullable: false,
        },
        fechaInicio: {
            type: "date",
            name: "fecha_inicio",
            nullable: false,
        },
        fechaFin: {
            type: "date",
            name: "fecha_fin",
            nullable: false,
        },
        estado: {
            type: "boolean",
            default: true,
            nullable: false,
        },
        descripcion: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        createdAt: {
            type: "timestamp",
            name: "created_at",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        updatedAt: {
            type: "timestamp",
            name: "updated_at",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            nullable: false,
        },
    },
});

export default SemestreSchema;
