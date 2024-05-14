const express = require("express");
const fs = require("fs");
const app = express();

app.listen(3000, () => {
  console.log("Escuchando puerto 3000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Función para crear carpeta deportes (si es que no existe) que alojará el archivo JSON
fs.readdir(".", (err, data) => {
  //console.log(data);
  if (data.includes("deportes")) {
    console.log("carpeta deportes ya existe");
  } else {
    fs.mkdir("deportes", (err, dir) => {
      if (err) {
        console.log("Hubo un error: ", err);
      } else {
        console.log("carpeta creada");
      }
    });
  }
});

//Función para crear/agregar deporte
const crearDeporte = (ruta, objeto) => {
  fs.writeFile(ruta, JSON.stringify(objeto), (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("deporte creado");
    }
  });
};

//Función para editar deporte
const editarEliminar = (ruta, nombre, objeto) => {
  fs.readFile(ruta, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const deportes = JSON.parse(data);
      const indice = deportes.deportes.findIndex((element) => {
        return element.nombre === nombre;
      });
      if (indice !== -1) {
        if (objeto) {
          deportes.deportes.splice(indice, 1, objeto);
          crearDeporte(ruta, deportes);
        } else {
          deportes.deportes.splice(indice, 1);
          crearDeporte(ruta, deportes);
        }
      }
    }
  });
};

//1. Crear una ruta que reciba el nombre y precio de un nuevo deporte, lo persista en un archivo JSON (3 Puntos).
app.get("/agregar", (req, res) => {
  const { nombre, precio } = req.query;
  const deporte = { nombre, precio };
  const path = "deportes/deportes.json";

  if (nombre === "" || precio === "") {
    res.send("Ingresa el nombre y precio correctamente");
  } else {
    if (fs.existsSync(path)) {
      fs.readFile(path, "utf-8", (err, data) => {
        const deportes = JSON.parse(data);
        deportes.deportes.push(deporte);
        crearDeporte(path, deportes);
        res.send("Deporte agregado");
      });
    } else {
      const deportes = { deportes: [] };
      deportes.deportes.push(deporte);
      crearDeporte(path, deportes);
      res.send("Deporte agregado");
    }
  }
});

//2. Crear una ruta que al consultarse devuelva en formato JSON todos los deportes registrados (2 Puntos).
app.use("/deportes", express.static(__dirname + "/deportes/deportes.json"));

//3. Crear una ruta que edite el precio de un deporte registrado utilizando los parámetros
//de la consulta y persista este cambio (2 Puntos).
app.get("/editar", (req, res) => {
  const { nombre, precio } = req.query;
  const deporte = { nombre, precio };
  const path = "deportes/deportes.json";
  editarEliminar(path, nombre, deporte);
  res.send("Deporte editado");
});

//4. Crear una ruta que elimine un deporte solicitado desde el cliente y persista este
//cambio (3 Puntos).
app.get("/eliminar", (req, res) => {
  const { nombre } = req.query;
  const path = "deportes/deportes.json";
  editarEliminar(path, nombre);
  res.send("Deporte eliminado");
});
