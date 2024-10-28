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
      type: "boolean", 
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
   
    inventario: {
      type: "many-to-one",
      target: "Inventario",
      joinColumn: true, 
      nullable: false,  
      onDelete: "CASCADE", 
    },

    
    prestamos: {
      type: "one-to-many",
      target: "Prestamos",
      inverseSide: "inventario",
    },
    codigosBarras: {
      type: "one-to-many",
      target: "CodigoBarras", 
      inverseSide: "item",
      cascade: true,
      onDelete: "CASCADE",
    },
  },
});

export default ItemSchema;
