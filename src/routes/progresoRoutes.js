import express from "express";

const router = express.Router();

router.get("/:puntos", (req, res) => {

    const puntos = parseInt(req.params.puntos);

    let nivel = "";
    let descripcion = "";

    if (puntos < 50) {
        nivel = "Nivel 1";
        descripcion = "Principiante";
    }
    else if (puntos < 100) {
        nivel = "Nivel 2";
        descripcion = "Intermedio";
    }
    else if (puntos < 150) {
        nivel = "Nivel 3";
        descripcion = "Avanzado";
    }
    else {
        nivel = "Nivel 4";
        descripcion = "Atleta Elite";
    }

    res.json({
        puntos,
        nivel,
        descripcion
    });

});

export default router;