"use strict";
import { EntitySchema } from "typeorm";

const InventarioSchema = new EntitySchema({
  name: "Inventario",
  tableName: "inventario",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    descripcion: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    cBarras: {
      type: "varchar",
      length: 255,
      nullable: false,
      unique: true,
    },
    categoria: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    estado: {
      type: "boolean",//en prestamo o disponible
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_INVENTARIO_ID", 
      columns: ["id"],
      unique: true, 
    },
    {
      name: "IDX_INVENTARIO_CBARRAS", 
      columns: ["cBarras"],
      unique: true, 
    },
    {
      name: "IDX_INVENTARIO_CATEGORIA", 
      columns: ["categoria"],
      unique: false, 
    },
  ],
  relations: { //relaciones con otras tablas
    prestamos: {
      type: "one-to-many",
      target: "Prestamos",
      inverseSide: "inventario",
    },
  },
});

export default InventarioSchema;