import { Foto } from "../foto.interface";
import { Localidad } from "../localidad.interface";
import { Rol } from "../rol.interface";
import { Usuario } from "../usuario.interface";
import { Categoria } from "./categoria.interface";

export interface Convenio {

    id: number,
    nombre: string,
    contacto: string,
    correo: string,
    direccion: string,
    telefono: number,
    cuit: number,
    baja: string,
    fechaAlta: string,
    fechaBaja: string,
    foto: Foto | null,
    localidad: Localidad,
    categoria: Categoria,
    usuario: Usuario,
    rol: Rol,

}