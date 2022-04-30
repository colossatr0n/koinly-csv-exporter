import { InputSourceType } from "../enum/input-source.enum";
import { InputSource } from "../input-source";
import { KoinlyInputSource } from "../koinly-input-source";

export class InputSourceFactory {

    constructor(
        private koinlyInputSource: KoinlyInputSource
    ) {}

    get(inputSourceType: InputSourceType): InputSource {
        switch (inputSourceType) {
            case InputSourceType.KOINLY: return this.koinlyInputSource
        }
    }
}