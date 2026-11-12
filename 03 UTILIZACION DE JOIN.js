
// CONSULTA DE PRESTAMOS VENCIDOS

db.prestamos.aggregate([
  { $match: { estado: "vencido" } },
  { $lookup: { from: "usuarios", localField: "usuario_id", foreignField: "_id", as: "usuario" } },
  { $lookup: { from: "audiolibros", localField: "audiolibro_id", foreignField: "_id", as: "audiolibro" } },
  { $unwind: "$usuario" },
  { $unwind: "$audiolibro" },
  { $project: { _id: 0, usuario: "$usuario.nombre", email: "$usuario.email",
                titulo: "$audiolibro.titulo", fecha_vencimiento: 1 } }
])

// CONSULTA DE PRESTAMOS ACTIVOS

db.prestamos.aggregate([
  { $match: { estado: "activo" } },
  { $lookup: { from: "usuarios", localField: "usuario_id", foreignField: "_id", as: "u" } },
  { $lookup: { from: "audiolibros", localField: "audiolibro_id", foreignField: "_id", as: "a" } },
  { $unwind: "$u" }, { $unwind: "$a" },
  { $project: { _id: 0, usuario: "$u.nombre", titulo: "$a.titulo", vence: "$fecha_vencimiento" } }
])