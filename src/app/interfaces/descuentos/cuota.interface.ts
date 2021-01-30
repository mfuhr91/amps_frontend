import { Descuento } from "./descuento.interface";

export interface Cuota {
    id: number,
    numCuota: number,
    montoCuota: number,
    fechaCuota: string,
    descuento: Descuento,
}