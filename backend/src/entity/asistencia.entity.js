"use strict";
import { EntitySchema } from "typeorm";
import SemestreSchema from "./semestre.entity.js";
import User from "./user.entity.js";

const AsistenciaSchema = new EntitySchema({
    name: "Asistencia",
    tableName: "asistencia",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        fecha: {
            type: "date",
            nullable: false,
        },
        presente: {
            type: "boolean",
            nullable: false,
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        updatedAt: {
            type: "timestamp",
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
        semestre: {
            type: "many-to-one",
            target: SemestreSchema,
            joinColumn: { name: "semestreId" },
        },
        profesor: {
            type: "many-to-one",
            target: User,
            joinColumn: { name: "profesorId" },
        },
    },
});

export default AsistenciaSchema;
