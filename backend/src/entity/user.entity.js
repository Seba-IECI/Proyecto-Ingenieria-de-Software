"use strict";
import { EntitySchema } from "typeorm";

const UserSchema = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombreCompleto: {
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
    nivel: {
      type: "varchar",
      length: 3,
      nullable: true,
      default: null,
    },
    especialidad: {
      type: "varchar",
      length: 50,
      nullable: true,
      default: null,
    },
    permisos: {
      type: "simple-array",
      nullable: true,
      default: null,
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
    amonestacionesActivas: {
      type: "int",
      default: 0,
    },
    amonestacionesTotales: {
      type: "int",
      default: 0,
      amonestacionesHistorical: []
    },
  },
  indices: [
    {
      name: "IDX_USER",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_USER_RUT",
      columns: ["rut"],
      unique: true,
    },
    {
      name: "IDX_USER_EMAIL",
      columns: ["email"],
      unique: true,
    },
  ],
  relations: {
    prestamos: {
      type: "one-to-many",
      target: "Prestamos",
      inverseSide: "usuario"
    },
    amonestaciones: {
      type: "one-to-many",
      target: "Amonestaciones",
      inverseSide: "usuario",
    },
  }
});

export default UserSchema;
