import { Convenio } from "../convenios/convenio.interface";
import { Socio } from "../socios/socio.interface";
import { Item } from "./item.interface";

export interface Descuento {
    id: number,
    descripcion: string,
    numCuotas: number,
    valorCuota: number,
    valorTotal: number,
    socio: Socio,
    convenio: Convenio,
    fechaAlta: Date,
    items: Item[],
}