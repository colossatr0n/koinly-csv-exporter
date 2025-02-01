import { CoinTrackerValueGetterFactory } from "./cointracker-value-getter.factory";
import { ValueGetterAbstractFactory } from "./value-getter.abstract.factory";
import { OutputType } from "../enum/output-type.enum";
import { Header } from "../type/header.type";

export class ValueGetterFactoryProvider {

    private coinTrackerValueGetterFactory: CoinTrackerValueGetterFactory = new CoinTrackerValueGetterFactory();

    constructor() {}

    get<T extends Header>(outputType: OutputType): ValueGetterAbstractFactory<T> {
        switch (outputType) { 
            case OutputType.COIN_TRACKER:
                return this.coinTrackerValueGetterFactory
            default:
                return this.coinTrackerValueGetterFactory;
        }
    }
}
