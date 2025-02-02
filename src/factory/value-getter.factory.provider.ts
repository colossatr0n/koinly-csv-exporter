import { CoinTrackerValueGetterFactory } from "./cointracker-value-getter.factory";
import { ValueGetterAbstractFactory } from "./value-getter.abstract.factory";
import { OutputType } from "../enum/output-type.enum";
import { Header } from "../type/header.type";
import { TurboTaxValueGetterFactory } from "./turbotax-value-getter.factory";

export class ValueGetterFactoryProvider {

    private coinTrackerValueGetterFactory: CoinTrackerValueGetterFactory = new CoinTrackerValueGetterFactory();
    private turboTaxValueGetterFactory: TurboTaxValueGetterFactory = new TurboTaxValueGetterFactory();

    constructor(
        coinTrackerValueGetterFactory: CoinTrackerValueGetterFactory = new CoinTrackerValueGetterFactory(),
        turboTaxValueGetterFactory: TurboTaxValueGetterFactory = new TurboTaxValueGetterFactory(),
    ) {
        this.coinTrackerValueGetterFactory = coinTrackerValueGetterFactory,
        this.turboTaxValueGetterFactory = turboTaxValueGetterFactory
    }

    get(outputType: OutputType): ValueGetterAbstractFactory {
        switch (outputType) { 
            case OutputType.COIN_TRACKER:
                return this.coinTrackerValueGetterFactory
            case OutputType.TURBO_TAX:
                return this.turboTaxValueGetterFactory
            default:
                throw "Unsupported type: " + outputType
        }
    }
}
