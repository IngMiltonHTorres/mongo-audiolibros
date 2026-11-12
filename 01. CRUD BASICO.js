// INSERCION DE PRUEBA
db.audiolibros.insertOne({
  titulo: "Nuevo Audiolibro", autor: "Autor Prueba", narrador: "Narrador Prueba",
  genero: "novela", idioma: "español", duracion_min: NumberInt(300),
  licencias_totales: NumberInt(2), licencias_disponibles: NumberInt(2), etiquetas: ["prueba"]
})

// PRUEBA DE CONSULTA BASICA
db.audiolibros.find({ genero: "misterio", licencias_disponibles: { $gt: 0 } })
db.usuarios.findOne({ email: "usuario1@correo.com" })

// PRUEBA DE ACTUALIZACION BASICA
db.usuarios.updateOne({ email: "usuario1@correo.com" }, { $set: { estado: "suspendido" } })
db.audiolibros.updateMany({ genero: "historia" }, { $set: { etiquetas: ["historia", "no ficción"] } })

// PRUEBA DE ELEMINACION BASICA
db.audiolibros.deleteOne({ titulo: "Nuevo Audiolibro" })