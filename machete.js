
app.listen(PORT, function(){
    console.log(`la api arranca en el puerto ${PORT}`);
// COMO USAR FORCE PARA ABRIR Y CERRAR EL SYNC, false: podes tocar la bd sin problema, no influye modificar tu api
// true: al hacer modificaciones en el codigo que modifique la tabla, actualiza automaticamente la bd
    sequelize.sync({ force: true}) 
        .then(()=>{
            console.log("se a conectado");
        }).catch(error => {
            console.log(`se produjo el error ${error}`);
        })
});

//RELACIONES
// ----------1 a 1----------
// usuario tiene una direccion
//añade una FK 'usuarioId' en la 'Direccion'
Usuario.hasOne(Direccion);

//añade una FK 'usuarioId' en la 'Direccion' -idem anterior
Direccion.belongsTo(Usuario);

/*
usuario
id | nombre | apellido 
1  | pepe   | pipon    

direccion
id | domicilio | usuarioId
10 | calle123  | 1
*/

/*-------------------------------------------------------------------------------------------------*/

//declaracion explicita
Usuario.hasOne(Direccion, {
    as: "suDireccion",
    foreignKey: "usuario_id"
});

Direccion.belongsTo(Usuario, {
    as: "esPropietario",
    foreignKey: "usuario_id"// si no asignamos esto y solo dejamos el hasOne anterior,
                            // en 'Direccion' va a seguir apareciendo 'usuarioId' y ademas 'usuario_id'
});
/*
usuario
id | nombre | apellido 
1  | pepe   | pipon    

direccion
id | domicilio | usuario_id
10 | calle123  | 1

(as: 'esPropietario', desde 'Direccion' y 'suDireccion' desde 'Usuario'. Si no es explicito queda 'usuarioId')
select * (get findAll) desde /usuario devuelve => 
{   
    "id":1,
    "nombre": "pepe",
    "apellido": "pipon",
    "suDireccion":{
            "id":10,
            "domicio": "calle123"
        }
}
select * (get findAll) desde /direccion devuelve =>
{   
    "id":10,
    "domicio": "calle123",
    "apellido": "pipon",
    "esPropietario":{
            "id":1,
            "nombre": "pepe",
            "apellido": "pipon"
        }        
}
*/

/*-------------------------------------------------------------------------------------------------*/

// ---------1 a N----------
//'Usuario' va a tener muchos 'Direccion' en su FK
// se añade una FK 'usuarioId' en la 'Direccion'
Usuario.hasMany(Direccion);

// se añade una FK 'usuarioId' en la 'Direccion' - idem anterior
Direccion.belongsTo(Usuario);
/*
usuario
id | nombre | apellido 
1  | pepe   | pipon    

direccion
id | domicilio | usuarioId
10 | calle123  | 1
20 | calle238  | 1
*/

/*-------------------------------------------------------------------------------------------------*/

//declaracion explicita
Usuario.hasMany(Direccion, { /* agrega FK en 'Direccion' con nombre 'usuario_id',
                                si nose declara de forma explicita es 'usuarioId' */
    as: "todasLasProp",
    foreignKey: "usuario_id"
});

Direccion.belongsTo(Usuario,{
    as: "esPropietario",
    foreignKey: "usuario_id"
});

/*
usuario
id | nombre | apellido 
1  | pepe   | pipon    

direccion
id | domicilio | usuario_id
10 | calle123  | 1
20 | calle238  | 1

(as: 'esPropietario', desde 'Direccion' y 'todasLasProp' desde 'Usuario', sino queda explicito queda 'usuarioId')
select * (get findAll) desde /usuario devuelve => 
{   
    "id":1,
    "nombre": "pepe",
    "apellido": "pipon",
    "todasLasProp":[
        {
            "id":10,
            "domicio": "calle123"
        },
        {
            "id":20,
            "domicio": "calle238"
        }
    ]
}
select * (get findAll) desde /direccion devuelve =>
al poder seleccionar solo 1 id de Domicilio, va a devolver una solucion

{   
    "id":10,
    "domicio": "calle123",
    "esPropietario":{
            "id":1,
            "nombre": "pepe",
            "apellido": "pipon"
        }
}
*/

/*-------------------------------------------------------------------------------------------------*/

// ---------N a N----------
//el 'Usuario' pertenece a muchas 'Banda' de Musica
//Esto crea una tabla intermedia en la BDD llamada "usuario_bandas"
Usuario.belongsToMany(Banda,{
    through: "usuario_bandas"
});

Banda.belongsToMany(Usuario,{ //mismo efecto
    through: "usuario_bandas"
});
//ESTO AGREGA FUNCIONES: usuario.addBandas usuario.getBandas ... etc.


//podemos crear una banda y llenarla con integrantes nuevos
Banda.create({
    grupo: "Class",
    tipo: "Folklore",
    usuario: [
        {nombre: "castro", apellido: "mascota"},
        {nombre: "forro", apellido: "a secas"}
    ]
    },{
        include: models.Usuario //deberia importarlo
    }
)
/*
usuario
id | nombre | apellido
3  | castro | mascota <-
4  | forro  | a secas <-

banda
id  | grupo      | tipo
200 | DeathSong  | Folklore <-

usuario_banda (tabla intermedia a traves de'THROUGH')
id  | usuarioId  | bandaId
1   | 3          | 200  <-
2   | 4          | 200  <-
*/

// luego de encontrar la banda a consultar 
//funciones add, set y get
unaBanda.addUsuarios([ usuarioA, usuarioB ]) //multiple

unaBanda.addUsuario(usuarioA) //de a uno sin 's'

unaBanda.setUsuarios([usuarioC, usuarioD]) // borra los integrantes del anterio, y establece nuevos

unaBanda.getUsuario({ attribute: ["name", "apellido"]})
//devuelve una promesa con los 'usuarios' de 'unaBanda'
//(se consulta la banda 'DeathSong')
/*
[
    {
        "nombre":"castro",
        "apellido" :"mascota",
        "usuario_banda": {  <- las FK referenciadas en la tabla Intermedia
            "usuarioId": 3,
            "bandaId": 200 
        }
    },
    {
        "nombre":"forro",
        "apellido" :"a secas",
        "usuario_banda": {  <- las FK referenciadas en la tabla Intermedia
            "usuarioId": 4,
            "bandaId": 200
        }
    }
]
*/