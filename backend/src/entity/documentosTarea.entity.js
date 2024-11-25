"use strict";
import { EntitySchema } from "typeorm";

const DocumentosTareaSchema = new EntitySchema({
    name: "DocumentosTarea",
    tableName: "documentos_tarea",
    columns:{
        id:{
            type: "int",
            primary: true,
            generated: true,
        },
        nombre:{
            type: "varchar",
            length: 500,
            nullable: false,
        },
        archivo:{
            type: "varchar",
            length: 500,
            nullable: false,
        },
        createdAt:{
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
    },
    relations:{
        user:{
            type: "many-to-one",
            target: "User",
            joinColumn: {name: "userId"},
        },
    },
});

export default DocumentosTareaSchema;