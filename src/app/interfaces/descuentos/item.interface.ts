import { Descuento } from "./descuento.interface";

export interface Item {
    id?: number,
    valorSubTotal: number,
    valorTotal: number,
    descuento?: Descuento
}