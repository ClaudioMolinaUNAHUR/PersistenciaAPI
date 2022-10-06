const sequelize = require('sequelize')
const Alumno = require('./models/alumno');
const Aula = require('./models/aulas');
const Carrera = require('./models/carrera');
const Materia = require('./models/materia');
const Profesor = require('./models/profesor');

const alumnos = [
    {nombre: "Matias", apellido: "Martin", dni: 41510152, id_carrera:1},
    {nombre: "Daniela", apellido: "Gomez", dni: 51515646, id_carrera:4},
    {nombre: "Alfonzo", apellido: "Amarilla", dni: 14531574, id_carrera:3},
    {nombre: "Homero", apellido: "Simpson", dni: 12485124, id_carrera:3},
    {nombre: "Cindy", apellido: "Otto", dni: 35818426, id_carrera:5},
    {nombre: "Chloe", apellido: "Deschanel", dni: 241842318, id_carrera:6},
];

const asistencia = [
    {presente:"",id_alumno:"", id_profesor:""}
];

const profesores = [
    {nombre: "Arturo", apellido: "Bolagnio", dni: 53184621, id_materia:100},
    {nombre: "Gladis", apellido: "Anton", dni: 21542611, id_materia:101},
    {nombre: "Emilio", apellido: "Sochi", dni: 15461811, id_materia:102},
    {nombre: "Juan", apellido: "Baltazar", dni: 12345678, id_materia:103},
    {nombre: "Pepe", apellido: "Pipon", dni: 98763544, id_materia:104},
    {nombre: "Lalo", apellido: "Landa", dni: 15678213, id_materia:105}
];

const carreras = [
    {id_carrera: 1,nombre: "Doc. Fisica"},
    {id_carrera: 2,nombre: "Abogacia"},
    {id_carrera: 3,nombre: "Ing. Informatica"},
    {id_carrera: 4,nombre: "Ing. Electromecanico"},
    {id_carrera: 5,nombre: "Ing. Quimico"},
    {id_carrera: 6,nombre: "Psicologia"}
];

const planes = [
    {id_carrera:1, id_materia:100},
    {id_carrera:1, id_materia:104},
    {id_carrera:2, id_materia:101},
    {id_carrera:2, id_materia:105},
    {id_carrera:2, id_materia:104},
    {id_carrera:3, id_materia:100},
    {id_carrera:3, id_materia:101},
    {id_carrera:3, id_materia:102},
    {id_carrera:3, id_materia:104},
    {id_carrera:4, id_materia:100},
    {id_carrera:4, id_materia:101},
    {id_carrera:4, id_materia:101},
    {id_carrera:4, id_materia:104},
    {id_carrera:5, id_materia:100},
    {id_carrera:5, id_materia:101},
    {id_carrera:5, id_materia:100},
    {id_carrera:6, id_materia:101},
    {id_carrera:6, id_materia:104},
    {id_carrera:6, id_materia:105}
];

const materias = [
    {id_materia: 100,nombre: "Matematica",id_aula: 1000},
    {id_materia: 101,nombre: "Ingles", id_aula: 1000},
    {id_materia: 102,nombre: "Programacion", id_aula: 1020},
    {id_materia: 103,nombre: "Soldadura", id_aula: 1010},
    {id_materia: 104,nombre: "Unahur", id_aula: 1000},
    {id_materia: 105,nombre: "Analisis Social", id_aula: 1000}
];

const aulas = [
    {id: 1000},
    {id: 1010},
    {id: 1020},
    {id: 1030},
    {id: 1040}
];

sequelize.sync({ force: false}).then( () => {
    console.log("Conexion Establecida...");
}).then(()=> {
    alumnos.forEach(alu => Alumno.create(alu));
}).then(()=> {
    profesores.forEach(prof => Profesor.create(prof));
}).then(()=> {
    carreras.forEach(carr => Carrera.create(carr));
}).then(()=> {
    materias.forEach(mat => Materia.create(mat));
}).then(()=> {
    aulas.forEach(aul => Aula.create(aul));
}).then(()=> {
    planes.forEach(plan => Plan.create(plan));
});

