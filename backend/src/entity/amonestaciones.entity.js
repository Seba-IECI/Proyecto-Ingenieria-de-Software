"use strict";
import { EntitySchema } from "typeorm";

const AmonestacionesSchema = new EntitySchema({
    name: "Amonestaciones",
    tableName: "amonestaciones",
    columns: {
    id: {
        type: "int",
        primary: true,
        generated: true,
    },
    descripcion: {
        type: "varchar",
        length: 255,
        nullable: false
    },
    fecha: {
        type: "timestamp with time zone",
        default: () => "CURRENT_TIMESTAMP",
        nullable: false
    }
},
relations: {
    usuario: {
    type: "many-to-one",
    target: "User",
    joinColumn: { name: "userId" },
    inverseSide: "amonestaciones",
    onDelete: "CASCADE", 
    },
}
});

export default AmonestacionesSchema;