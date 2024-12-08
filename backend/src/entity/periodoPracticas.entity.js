"use strict";
import { EntitySchema } from "typeorm";

const PeriodoPracticaSchema = new EntitySchema({
    name: "PeriodoPractica",
    tableName: "PeriodoPractica",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        fechaInicio:{
            type: "date",
            nullable: false,
        },
        fechaFin:{
            type: "date",
            nullable: false,
            },
        habilitado:{
            type: Boolean,
            default: true,
            nullable: false,
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
export default PeriodoPracticaSchema;