import { Descuento } from "./descuento.interface";

export interface Cuota {
    id: number,
    numCuota: number,
    valor: number,
    fecha: string,
    descuento: Descuento,
}