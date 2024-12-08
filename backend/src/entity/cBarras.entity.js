import { EntitySchema } from "typeorm";

const CodigoBarrasSchema = new EntitySchema({
  name: "CodigoBarras",
  tableName: "codigos_barras",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    codigo: {
      type: "varchar",
      length: 255,
      unique: true, 
      nullable: false,
    },
    disponible: { 
      type: "boolean", 
      nullable: false, 
      default: true,
    },
    lote: {
      type: "varchar",
      length: 100,
      nullable: true, 
    },
  },
  relations: {
    item: {
      type: "many-to-one",
      target: "Item",
      joinColumn: { name: "itemId" },
      onDelete: "CASCADE",
      nullable: true,
    },
    prestamo: {
      type: "many-to-one",
      target: "Prestamos", 
      inverseSide: "codigosBarras", // Debe coincidir con el nombre en PrestamosSchema
      joinColumn: { name: "prestamo_id" },
      cascade : true,
      onDelete: "CASCADE",
    },
  },
});

export default CodigoBarrasSchema;
