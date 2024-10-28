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
      unique: true, // El código de barras debe ser único en la tabla
      nullable: false,
    },
    lote: {
      type: "varchar",
      length: 100,
      nullable: true, // Opcional: puedes agregar información adicional sobre el lote
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
