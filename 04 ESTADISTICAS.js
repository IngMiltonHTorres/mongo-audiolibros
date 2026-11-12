// PRESTAMOS POR ESTADO
db.prestamos.aggregate([
  { $group: { _id: "$estado", total: { $sum: 1 } } }
])


// PRESTAMOS POR GENERO
db.prestamos.aggregate([
  { $lookup: { from: "audiolibros", localField: "audiolibro_id", foreignField: "_id", as: "libro" } },
  { $unwind: "$libro" },
  { $group: { _id: "$libro.genero", prestamos: { $sum: 1 } } },
  { $sort: { prestamos: -1 } }
])


// PROMEDIO DE DIAS PRESTADOS A ESTADO DEVUELTO
db.prestamos.aggregate([
  { $match: { estado: "devuelto" } },
  { $group: { _id: null, promedioDias: { $avg: {
      $dateDiff: { startDate: "$fecha_prestamo", endDate: "$fecha_devolucion", unit: "day" } } } } }
])

// USUARIOS CON LIBROS VENCIDOS
db.prestamos.aggregate([
  { $match: { estado: "vencido" } },
  { $group: { _id: "$usuario_id", vencidos: { $sum: 1 } } },
  { $lookup: { from: "usuarios", localField: "_id", foreignField: "_id", as: "u" } },
  { $unwind: "$u" },
  { $project: { _id: 0, usuario: "$u.nombre", vencidos: 1 } }
])

// DURACION PROMEDIO POR GENERO
db.audiolibros.aggregate([
  { $group: { _id: "$genero", cantidad: { $sum: 1 }, duracionPromedio: { $avg: "$duracion_min" },
              licencias: { $sum: "$licencias_totales" } } },
  { $sort: { cantidad: -1 } }
])