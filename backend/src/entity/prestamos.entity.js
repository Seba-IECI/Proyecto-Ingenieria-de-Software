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
    codigosAsociados: {
      type: "text", // Usa "text" para almacenar JSON serializado
      nullable: true,
    },
    // Nuevo campo: Ítems asociados al préstamo
    itemsAsociados: {
      type: "text", // Usa "text" para almacenar JSON serializado
      nullable: true,
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
    
    codigosBarras: {
      type: "one-to-many",
      target: "CodigoBarras",
      inverseSide: "prestamo",
      onDelete: "CASCADE",
    }
    
  },                   
});

export default PrestamosSchema;
