import express from "express";

const router = express.Router();

router.post("/api/beneficio", (req, res) => {

  res.json({
    ok: true,
    mensaje: "Beneficio aplicado correctamente"
  });

});

export default router;