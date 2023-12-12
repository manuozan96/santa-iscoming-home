const express = require("express");
const { Pool } = require("pg");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Configura la conexión a PostgreSQL
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Ruta para recibir datos del formulario
app.post("/", async (req, res) => {
  try {
    const { nombre, correo, fecha, selectedTime } = req.body;
    // Lógica para guardar datos en la base de datos
    console.log("Datos recibidos");
    const result = await pool.query(
      "INSERT INTO fechas (nombre, correo, fecha, horario) VALUES ($1, $2, $3, $4)",
      [nombre, correo, fecha, selectedTime]
    );

    console.log("Datos guardados exitosamente:", result.rows);
    res.status(201).json({ mensaje: "Datos guardados exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al guardar datos." });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
