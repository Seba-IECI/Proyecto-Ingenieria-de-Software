import cron from "node-cron";
import { AppDataSource } from "../data-source";
import Prestamos from "../entities/Prestamos";
import User from "../entities/User";
import { procesarPrestamoVencidoService } from "../services/prestamos.service.js";

export async function revisarPrestamos() {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamos);
    const usuarioRepository = AppDataSource.getRepository(User);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1); 
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1); 

   
    const prestamosVencidosAyer = await prestamoRepository.find({
      where: {
        fechaVencimiento: ayer,
        estado: 1,
      },
      relations: ["usuario"],
    });

 

   
    const prestamosQueVencenMañana = await prestamoRepository.find({
      where: {
        fechaVencimiento: mañana,
        estado: 1,
      },
      relations: ["usuario"],
    });

    for (let prestamo of prestamosVencidosAyer) {
      const [resultado, error] = await procesarPrestamoVencidoService(prestamo.id);
      if (error) {
        console.error("Error al procesar el préstamo vencido con ID " + prestamo.id + ":", error);
      } else {
        console.log("Préstamo vencido procesado:", resultado);
      }
    }
    

    for (let prestamo of prestamosQueVencenMañana) {
      const usuario = prestamo.usuario;
      // implementar  enviar notificaciones
      
      console.log(`Notificación: El préstamo de ${usuario.nombre} vence mañana`);
    }

    return "Revisión de préstamos completada";
  } catch (error) {
    console.error("Error en la revisión de préstamos:", error);
    return "Error interno del servidor";
  }
}


cron.schedule("0 0 * * *", () => {
  revisarPrestamos()
    .then(console.log)
    .catch(console.error);
});