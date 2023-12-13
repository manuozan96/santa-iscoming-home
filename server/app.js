const express = require("express");
const { Pool } = require("pg");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(express.json());

// Middleware para manejar rutas sin la extensión .html
app.use((req, res, next) => {
  if (path.extname(req.path) === "" && req.path.slice(-1) !== "/") {
    res.redirect(req.path + "/");
  } else {
    next();
  }
});

// Configura la conexión a PostgreSQL
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Middleware para manejar rutas con extensión .html
app.use((req, res, next) => {
  if (path.extname(req.path) === ".html") {
    res.redirect(req.path.slice(0, -5)); // Redirige eliminando la extensión .html
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

app.get("/:page", (req, res) => {
  res.sendFile(path.join(__dirname, "public", req.params.page + ".html"));
});

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
