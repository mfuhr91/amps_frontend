import { Convenio } from "../convenios/convenio.interface";
import { Socio } from "../socios/socio.interface";
import { Cuota } from "./cuota.interface";
import { Item } from "./item.interface";

export interface Descuento {
    id?: number,
    descripcion: string,
    numCuotas?: number,
    valorCuota?: number,
    valorSubTotal?: number,
    valorTotal: number,
    socio: Socio,
    convenio?: Convenio,
    fechaAlta?: string,
    ultimaCuota?: string,
    cuotas?: Cuota[],
    items: Item[],
}