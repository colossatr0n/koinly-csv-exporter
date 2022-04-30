import { Header } from "../type/header.type";
import { ValueGetter } from "../type/value-getter.type";

export interface ValueGetterAbstractFactory<T> {
    get(header: Header): ValueGetter<T>
}