// CONSULTA POR RANGO
db.audiolibros.find({ duracion_min: { $gte: 300, $lte: 600 }, idioma: "español" })

// UTILIZACION OR
db.audiolibros.find({ $or: [{ genero: "fantasía" }, { genero: "misterio" }], licencias_disponibles: { $gt: 1 } })

// UTILIZACION IN
db.usuarios.find({ ciudad: { $in: ["Bogotá", "Medellín"] } })

// CONSULTA POR TEXTO PARCIAL
db.audiolibros.find({ titulo: { $regex: /^Audiolibro 1/ } })

// CONSULTAR POR CRITERIO PREFERENCIA
db.usuarios.find({ preferencias: "novela" })

// CONSULTA PROYECCION
db.audiolibros.find({ genero: "novela" }, { titulo: 1, autor: 1, _id: 0 }).sort({ duracion_min: -1 }).limit(5)