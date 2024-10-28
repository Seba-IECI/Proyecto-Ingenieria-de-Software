"use strict";
import { EntitySchema } from "typeorm";

const ItemSchema = new EntitySchema({
  name: "Item",
  tableName: "item",
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
    descripcion: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    categoria: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    estado: {
      type: "boolean", // en prestamo o disponible
      nullable: false,
      default: false,
    },
    cantidad: {
      type: "int",
      nullable: false,
      default: 1,
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

  relations: {
    // Relación con la tabla Inventario
    inventario: {
      type: "many-to-one",
      target: "Inventario",
      joinColumn: true, // Crea la columna de clave foránea en Item
      nullable: false,  // Asegura que cada Item esté asociado a un Inventario
      onDelete: "CASCADE", // Elimina el item si el inventario es eliminado
    },

    // Relación con la tabla Prestamos
    prestamos: {
      type: "one-to-many",
      target: "Prestamos",
      inverseSide: "inventario",
    },
    codigosBarras: {
      type: "one-to-many",
      target: "CodigoBarras", // Nombre de la entidad de código de barras
      inverseSide: "item",
      cascade: true,
      onDelete: "CASCADE",
    },
  },
});

export default ItemSchema;
