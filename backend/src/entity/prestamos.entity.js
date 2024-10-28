"use strict";
import { EntitySchema } from "typeorm";

const PrestamosSchema = new EntitySchema({
  name: "Prestamos",
  tableName: "prestamos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    fechaPrestamo: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    fechaDevolucion: {
      type: "timestamp with time zone",
      nullable: true,  // Puede ser nulo hasta que se devuelva el artículo
    },
    estado: {
      type: "int",
      default: 0,  // 0: pendiente, 1: devuelto
      nullable: false,
    },
  },
  relations: {
    usuario: {
      type: "many-to-one",
      target: "User",  // Relación con la tabla 'users'
      joinColumn: { name: "user_id" },  // Columna en la tabla prestamos que hará referencia al id del usuario
      nullable: false,  // Cada préstamo debe tener un usuario
      onDelete: "CASCADE",  // Si se elimina un usuario, también se eliminan los préstamos asociados
    },
    inventario: {
      type: "many-to-one",
      target: "Inventario",  // Relación con la tabla 'inventario'
      joinColumn: { name: "inventario_id" },  // Columna que hará referencia al artículo del inventario
      nullable: false,  // Cada préstamo debe estar asociado a un artículo
      onDelete: "CASCADE",  // Si se elimina un artículo, también se eliminan los préstamos asociados
    },
  },
});

export default PrestamosSchema;
