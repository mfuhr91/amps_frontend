import { Descuento } from "./descuento.interface";

export interface Item {
    id?: number,
    valor: number,
    descuento?: Descuento
}