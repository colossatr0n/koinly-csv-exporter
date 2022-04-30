import { KoinlyValueGetterFactory } from "./koinly-value-getter.factory";
import { InputSourceType } from "../enum/input-source.enum";
import { ValueGetterAbstractFactoryProvider } from "./value-getter.abstract.factory.provider";
import { ValueGetterAbstractFactory } from "./value-getter.abstract.factory";

export class ValueGetterFactoryProvider implements ValueGetterAbstractFactoryProvider {

    constructor(
        private koinlyValueGetterFactory: KoinlyValueGetterFactory
    ) {}

    get(inputSource: InputSourceType): ValueGetterAbstractFactory {
        switch (inputSource) {
            case InputSourceType.KOINLY:
                return this.koinlyValueGetterFactory
        }
    }
}
