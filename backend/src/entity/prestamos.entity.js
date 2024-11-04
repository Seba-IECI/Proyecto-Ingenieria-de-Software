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
      nullable: true,
    },
    fechaVencimiento: {
      type: "timestamp with time zone",
      nullable: false,
    },
    estado: {
      type: "int",
      default: 0,
      nullable: false,
    },
  },
  relations: {
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      nullable: false,
      onDelete: "CASCADE",
    },
    item: {
      type: "many-to-one",
      target: "Item",
      joinColumn: { name: "item_id" },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});

export default PrestamosSchema;
