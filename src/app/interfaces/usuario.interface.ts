import { Rol } from "./rol.interface";

export interface Usuario {
    id: number,
    nombreUsuario: string,
    contraseña: string,
    fechaAlta: string,
    fechaBaja: string,
    rol: Rol,
}