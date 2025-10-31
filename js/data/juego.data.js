'use strict';
import { Usuarios } from "../models/juego.model.js";

const jsonUsuarios = `[
  {"id":1, "nombre" : "Iker", "apellido" : "Arana", "usuario":"iarana", "contrasena":"1234Abcd"},
  {"id":2, "nombre" : "Ander", "apellido" : "Goikoetxea", "usuario":"agoikoetxea", "contrasena":"5678Efgh"},
  {"id":3, "nombre" : "Jokin", "apellido" : "Olano", "usuario":"jolano", "contrasena":"9012Ijkl"}
]`;


const usuarios_bd = JSON.parse(jsonUsuarios);

export const USUARIOS_DB = usuarios_bd.map(
  usuario =>
    new Usuarios(
      usuario.id,
      usuario.nombre,
      usuario.apellido,
      usuario.usuario,
      usuario.contrasena
    )
);
