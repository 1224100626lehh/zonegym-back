import { Router } from "express";
import Reservation from "../models/Reservation.js";

const router = Router();

// Crear reserva
router.post("/", async (req, res) => {
  try {
    console.log("BODY RECIBIDO EN RESERVA:", req.body);

    const { classId, className, date, time, name, email, phone } = req.body;

    if (!classId || !className || !date || !time || !name || !email) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    const reservation = await Reservation.create({
      classId,
      className,
      date,
      time,
      name,
      email,
      phone: phone || "",
      status: "pending",
    });

    return res.status(201).json({
      message: "Reserva creada correctamente",
      reservation,
    });
  } catch (error) {
    console.error("ERROR CREANDO RESERVA:", error);
    return res.status(500).json({ message: "Error creando reserva." });
  }
});

// Ver reservas
router.get("/", async (_req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    return res.json(reservations);
  } catch (error) {
    console.error("ERROR OBTENIENDO RESERVAS:", error);
    return res.status(500).json({ message: "Error obteniendo reservas." });
  }
});

export default router;
