"use strict";
import { EntitySchema, JoinColumn } from "typeorm";

const MaterialEstudioSchema = new EntitySchema({
name:"MaterialEstudio",
tableName:"material_estudio",
columns:{
    id:{
        type:"int",
        primary:true,
        generated:true,
    },
    titulo:{
        type:"varchar",
        length:255,
        nullable:false,
    },
    descripcion:{
        type:"text",
        nullable:true,
    },
   url:{
    type: "varchar",
    length: 255,
    nullable: true,
   },
   createdAt:{
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
    nullable: false,
   }
},
    indices: [
        {
            name: "IDX_MATERIAL_ESTUDIO",
            columns: ["id"],
            unique: true,
        },
        {
            name: "IDX_MATERIAL_ESTUDIO_TITULO",
            columns: ["titulo"],
            unique: true,
        },
    ],
});

export default MaterialEstudioSchema;