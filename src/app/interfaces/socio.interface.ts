import { Categoria } from "./categoria.interface";
import { EstadoCivil } from "./estado-civil.interface";
import { Localidad } from "./localidad.interface";
import { TipoDocumento } from "./tipo-documento.interface";
import { Usuario } from "./usuario.interface";

export interface Socio {
    
    id: number,
    nombre: string,
    apellido: string,
    numDoc: number,
    correo: string,
    fechaAlta: string,
    fechaBaja: string,
    cuotaSocial: number,
    direccion: string,
    extranjero: boolean,
    fechaIngresoLaboral: string,
    fechaNacimiento: string,
    foto: string,
    legajo: number,
    motivoBaja: string,
    numCuenta: number,
    baja: string,
    telefono: number,
    cuil: string,
    
    categoria: Categoria,
    estadoCivil: EstadoCivil,
    tipoDocumento: TipoDocumento,
    usuario: Usuario,
    localidad: Localidad,
}















