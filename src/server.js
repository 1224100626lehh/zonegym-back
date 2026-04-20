import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from 'helmet';
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import pagosRoutes from "./routes/pagosRoutes.js";
import reservationsRoutes from "./routes/reservations.routes.js";
import User from "./models/User.js";
import progresoRoutes from "./routes/progresoRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import beneficioRoutes from "./routes/beneficio.routes.js";
import { usuarioRoutes } from "./routes/usuarios.js";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import { filterXSS as xss } from "xss";

dotenv.config();
connectDB();

const app = express();

app.use(helmet());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

const comentarioLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10,
  message: { error: "Demasiadas peticiones, espera un minuto." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post(
  "/api/comentarios",
  comentarioLimiter,
  [
    body("texto")
      .notEmpty().withMessage("El texto es obligatorio")
      .isLength({ max: 200 }).withMessage("El texto no puede superar 200 caracteres"),
    body("puntuacion")
      .notEmpty().withMessage("La puntuación es obligatoria")
      .isInt().withMessage("La puntuación debe ser un número entero"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    const texto = xss(req.body.texto);
    const puntuacion = req.body.puntuacion;
    res.json({ comentario: texto, puntuacion });
  }
);

app.use("/api/users", userRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/progreso", progresoRoutes);
app.use("/api/streak", streakRoutes);
app.use(beneficioRoutes);
app.use("/api/reservations", reservationsRoutes);
usuarioRoutes(app);

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

const crearAdminPorDefecto = async () => {
  try {
    const adminEmail = "admin@zonegym.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("Admin123*", 10);

      await User.create({
        name: "Administrador ZoneGym",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isActive: true,
        membershipStatus: "active",
      });

      console.log("Admin por defecto creado");
    } else {
      console.log("Admin ya existe");
    }
  } catch (error) {
    console.error("Error creando admin:", error);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  await crearAdminPorDefecto();
});