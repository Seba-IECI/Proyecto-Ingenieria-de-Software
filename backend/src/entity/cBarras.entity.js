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
      onDelete: "CASCADE",
    },
  },
});

export default CodigoBarrasSchema;
