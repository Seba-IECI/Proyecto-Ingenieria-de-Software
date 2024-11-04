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
    hoy.setHours(0, 0, 0, 0); // Fecha de hoy a las 00:00
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1); // Fecha de ayer
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1); // Fecha de mañana

    // **1. Amonestar préstamos vencidos (ayer)**
    const prestamosVencidosAyer = await prestamoRepository.find({
      where: {
        fechaVencimiento: ayer,
        estado: 1,
      },
      relations: ["usuario"],
    });

 

    // **2. Notificar a usuarios con préstamos que vencen mañana**
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
      // Aquí puedes implementar una función para enviar notificaciones
      // Por ejemplo: enviarNotificacion(usuario, `Tu préstamo vence mañana`);
      console.log(`Notificación: El préstamo de ${usuario.nombre} vence mañana`);
    }

    return "Revisión de préstamos completada";
  } catch (error) {
    console.error("Error en la revisión de préstamos:", error);
    return "Error interno del servidor";
  }
}

// Configurar el cron job para que se ejecute a las 00:00 todos los días
cron.schedule("0 0 * * *", () => {
  revisarPrestamos()
    .then(console.log)
    .catch(console.error);
});
