"use strict";
import { EntitySchema } from "typeorm";

const EncargadoSchema = new EntitySchema({
  name: "Encargado_practicas",
  tableName: "Encargado",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 12,
      nullable: false,
      unique: true,
    },
    email: {
      type: "varchar",
      length: 255,
      nullable: false,
      unique: true,
    },
    rol: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    password: {
      type: "varchar",
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
      name: "IDX_ENCARGADO",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_ENCARGADO_RUT",
      columns: ["rut"],
      unique: true,
    },
    {
      name: "IDX_ENCARGADO_EMAIL",
      columns: ["email"],
      unique: true,
    },
  ],
});

export default EncargadoSchema;

