import { readFileSync } from "fs";
import { InputSource as InputSource } from "./input-source";
import { KoinlyValueGetterFactory } from "./factory/koinly-value-getter.factory";

export class KoinlyInputSource implements InputSource {

    constructor(
        private koinlyValueGetterFactory: KoinlyValueGetterFactory
    ) {}

    read(jsonFilePath: string): string {
        return JSON.parse(
            readFileSync(jsonFilePath, 'utf8').toString()
        )
    }

    getValueGetterFactory() {
        return this.koinlyValueGetterFactory
    }
}
