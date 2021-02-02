
import { Tipo } from "./tipo.interface";
import { EstadoCivil } from "./estado-civil.interface";
import { Foto } from "../foto.interface";
import { Localidad } from "../localidad.interface";
import { TipoDocumento } from "./tipo-documento.interface";
import { Usuario } from "../usuario.interface";
import { Variable } from "../variable.interface";

export interface Socio {
    
    id: number,
    nombre: string,
    apellido: string,
    numDoc: number,
    correo: string,
    fechaAlta: string,
    fechaBaja: string,
    direccion: string,
    extranjero: boolean,
    fechaIngresoLaboral: string,
    fechaNacimiento: string,
    legajo: number,
    motivoBaja: string,
    numCuenta: number,
    baja: string,
    telefono: number,
    cuil: string,
    cuotaDeporte: number,
    seguroVida: number,
    
    cuotaSocial: Variable;
    foto: Foto,
    tipo: Tipo,
    estadoCivil: EstadoCivil,
    tipoDocumento: TipoDocumento,
    usuario: Usuario,
    localidad: Localidad,
}















