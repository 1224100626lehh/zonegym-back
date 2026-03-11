import express from "express";

const router = express.Router();

let streak = 0;

router.get("/", (req, res) => {
  res.json({
    streak
  });
});

router.post("/entrenar", (req, res) => {

  streak += 1;

  res.json({
    mensaje: "Entrenamiento registrado",
    streak
  });

});

router.post("/reset", (req, res) => {

  streak = 0;

  res.json({
    mensaje: "Racha reiniciada"
  });

});

export default router;