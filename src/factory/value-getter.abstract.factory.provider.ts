import { InputSourceType } from "../enum/input-source.enum";
import { ValueGetterAbstractFactory } from "./value-getter.abstract.factory";

export interface ValueGetterAbstractFactoryProvider {
    get(inputSource: InputSourceType): ValueGetterAbstractFactory
}