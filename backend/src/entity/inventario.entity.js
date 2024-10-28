import { EntitySchema } from "typeorm";

const InventarioSchema = new EntitySchema({
  name: "Inventario",
  tableName: "inventarios",
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
      length: 500,
      nullable: true,
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
    items: {
      type: "one-to-many",
      target: "Item",
      inverseSide: "inventario",
      cascade: true,
    },
    prestamos: {
      type: "one-to-many",
      target: "Prestamos",
      inverseSide: "inventario",
      cascade: true,
    },  // Relación con la tabla 'prestamos'

  },
});

export default InventarioSchema;
