import { addAmonestacionRut } from "../services/amonestaciones.service.js";

export async function addAmonestacionRutController(req, res) {
  try {

    console.log("llegamos aca al conteroller")
    const { identifier } = req.body;
         
    if (!identifier ) {
      return res.status(400).json({ error: "El campo de rut/id es obligatorio." });
    }
    
    const [result, error] = await addAmonestacionRut(identifier);

    if (error) {
      return res.status(400).json({ error });
    }

   
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en addAmonestacionRutController:", error);
    return res.status(500).json({ error: "Error internollego aca  del servidor." });
  }
}
