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
    amonestacionesActivas: { // Amonestaciones activas
      type: "int",
      default: 0,
    },
    amonestacionesTotales: { // Total de amonestaciones
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
  relations: { //relacion con tabla inventario
    prestamos: {
      type: "one-to-many",
      target: "Prestamos",
      inverseSide: "usuario"
    },
     amonestaciones: { // Relación con la entidad Amonestacion
      type: "one-to-many",
      target: "Amonestaciones",
      inverseSide: "usuario", // Hace referencia al campo 'usuario' en Amonestacion
    },
  }
}
);

export default UserSchema;