import { Header } from "../type/header.type";
import { ValueGetter } from "../type/value-getter.type";

export interface ValueGetterAbstractFactory {
    get(header: Header): ValueGetter
}