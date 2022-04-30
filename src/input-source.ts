import { ValueGetterAbstractFactory } from "./factory/value-getter.abstract.factory"

export interface InputSource {
    read(a: any): any
    getValueGetterFactory(): ValueGetterAbstractFactory
}