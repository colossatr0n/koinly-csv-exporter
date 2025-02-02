import { OutputType } from "../enum/output-type.enum";
import { CoinTrackerValidator } from "../validator/coin-tracker.validator";
import { TurboTaxValidator } from "../validator/turbotax.validator";
import { Validator } from "../validator/validator";

export class ValidatorFactory {

    constructor() {}

    get(outputType: OutputType): Validator {
        switch (outputType) { 
            case OutputType.COIN_TRACKER:
                return new CoinTrackerValidator()
            case OutputType.TURBO_TAX:
                return new TurboTaxValidator()
            default:
                return new CoinTrackerValidator()
        }
    }
}
