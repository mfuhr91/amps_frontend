export class LoginUsuario {

    nombreUsuario: string;
    contrasena: string;
    rol?: string | null; 
    constructor(nombreUsuario: string, contrasena: string) {
        this.nombreUsuario = nombreUsuario;
        this.contrasena = contrasena;
    }
}
