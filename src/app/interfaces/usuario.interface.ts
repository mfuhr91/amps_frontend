import { Rol } from "./rol.interface";

export interface Usuario {
    id: number,
    nombreUsuario: string,
    contrasena: string,
    contrasena2?: string,
    fechaAlta: string,
    fechaBaja: string,
    rol: Rol,
}