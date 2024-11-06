"use strict";
import { EntitySchema, JoinColumn } from "typeorm";

const TareaSchema = new EntitySchema({
name:"Tarea",
tableName:"tarea",
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
    fecha_entrega:{
        type:"date",
        nullable:false,
    },
    createdAt:{
        type:"timestamp with time zone",
        default:() => "CURRENT_TIMESTAMP",
        nullable:false,
    },
    habilitada:{
        type:"boolean",
        default:false,
        nullable:false,
    },
},
   indices:[
         {
              name:"IDX_TAREA",
              columns:["id"],
              unique:true,
         },
         {
            name:"IDX_TAREA_TITULO",
            columns:["titulo"],
            unique:false,
         }

   ]
});

export default TareaSchema;