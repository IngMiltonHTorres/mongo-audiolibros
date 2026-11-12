const generos = ["novela", "misterio", "ciencia ficción", "historia", "autoayuda", "fantasía"];
const idiomas = ["español", "inglés"];
const ciudades = ["Bogotá", "Medellín", "Cali", "Barranquilla"];

// INSERCION DINAMICA DE 30 USUARIOS

const usuarios = [];
for (let i = 1; i <= 30; i++) {
  usuarios.push({
    nombre: "Usuario " + i,
    email: `usuario${i}@correo.com`,
    telefono: "300" + (1000000 + i * 137),
    ciudad: ciudades[i % ciudades.length],
    estado: "activo",
    fecha_registro: new Date(2026, 0, i),
    preferencias: [generos[i % generos.length]]
  });
}
db.usuarios.insertMany(usuarios);

// INSERCION DINAMICA DE 100 LIBROS

const libros = [];
for (let i = 1; i <= 100; i++) {
  const lic = 1 + (i % 5);
  libros.push({
    titulo: "Audiolibro " + i,
    autor: "Autor " + (i % 20 + 1),
    narrador: "Narrador " + (i % 10 + 1),
    genero: generos[i % generos.length],
    idioma: idiomas[i % 2],
    duracion_min: NumberInt(120 + (i * 7) % 900),
    anio_publicacion: NumberInt(1980 + (i % 45)),
    licencias_totales: NumberInt(lic),
    licencias_disponibles: NumberInt(lic),
    etiquetas: [generos[i % generos.length]]
  });
}
db.audiolibros.insertMany(libros);

// INSERCION DINAMICA DE PRESTAMOS

const idsU = db.usuarios.find({}, { _id: 1 }).toArray().map(d => d._id);
const idsL = db.audiolibros.find({}, { _id: 1 }).toArray().map(d => d._id);
const dia = 24 * 60 * 60 * 1000;
const ahora = new Date();

const prestamos = [];
for (let i = 0; i < 120; i++) {
  const abierto = i >= 100;                         // los últimos 20 siguen sin devolver
  const inicio = new Date(ahora.getTime() - (5 + (i * 3) % 120) * dia);
  const vence = new Date(inicio.getTime() + 14 * dia);
  prestamos.push({
    usuario_id: idsU[i % idsU.length],
    audiolibro_id: idsL[(i * 7) % idsL.length],
    fecha_prestamo: inicio,
    fecha_vencimiento: vence,
    fecha_devolucion: abierto ? null : new Date(inicio.getTime() + (3 + i % 10) * dia),
    estado: abierto ? (vence < ahora ? "vencido" : "activo") : "devuelto",
    abierto: abierto,
    seguimiento: []
  });
}
db.prestamos.insertMany(prestamos);

// ACTUALIZACION FECHAS DE VENCIMIENTO Y ESTADO ACTIVOS

db.prestamos.find({ abierto: true }).limit(8).forEach(p => {
  const inicio = new Date(Date.now() - 3 * 86400000);
  db.prestamos.updateOne({ _id: p._id }, { $set: {
    fecha_prestamo: inicio,
    fecha_vencimiento: new Date(inicio.getTime() + 14 * 86400000),
    estado: "activo"
  }});
});

// DESCONTAR LICENCIAS DE PRESTAMOS QUE SIGUEN ABIERTOS

db.prestamos.find({ abierto: true }).forEach(p =>
  db.audiolibros.updateOne({ _id: p.audiolibro_id }, { $inc: { licencias_disponibles: -1 } })
);

// VERIFICACION DE INSERCIONES

db.usuarios.countDocuments()                           // 30
db.audiolibros.countDocuments()                        // 100
db.prestamos.countDocuments()                          // 120
