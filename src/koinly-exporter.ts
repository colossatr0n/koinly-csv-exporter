#!/usr/bin/env node
'use strict';

/*
 * Converts Koinly transactions into a various CSV uploads for crypto portfolio sites and tax sites.
 *
 * HOW TO:
 *
 * View transactions on Koinly and use `util/fetch-all-transactions.js` (read the HOW TO there).
 * Then build and run program:
 *     npm run build-start-turbotax -- some-koinly-data.json -o output.csv 
 *
 * NOTE:
 * Be aware that if you open the CSV in Excel, it might change the date format to be incompatible with 
 * a given website's csv requirements.
 *
 */


import { ArgumentParser } from "argparse";
import { OutputType } from "./enum/output-type.enum";
import { readFileSync, writeFileSync } from "fs";
import { ValueGetterFactoryProvider } from "./factory/value-getter.factory.provider";
import { ValidatorFactory } from "./factory/validator-factory-provider";
import { Header } from "./type/header.type";
import { OptionalHeader } from "./enum/optional-header.enum";
import { createCsv } from "./csv";
import { RequiredHeadersFactory } from "./factory/required-headers-factory";


function main(args: any) {
    const outputType = OutputType[args.type as keyof typeof OutputType]
    const valueGetterFactory = new ValueGetterFactoryProvider().get(outputType)
    const orderedHeaders = new RequiredHeadersFactory().get(outputType)
    const validator = new ValidatorFactory().get(outputType)
    
    let files: string[] = args.files
    let txnSet = new Set()
    let txns = files.map(txnFile => JSON.parse(readFileSync(txnFile, 'utf8').toString()))
                    .flat()
                    .filter(txn => !txnSet.has(JSON.stringify(txn)) 
                                    ? txnSet.add(JSON.stringify(txn)) 
                                    : false)

    let headers: Header[]

    if (args.extra) {
        const ORDERED_OPT_HEADERS = [
            OptionalHeader.TYPE,
            OptionalHeader.LABEL,
            OptionalHeader.RECEIVER_WALLET,
            OptionalHeader.SENDER_WALLET,
            OptionalHeader.RECEIVER_COST_BASIS,
            OptionalHeader.SENDER_COST_BASIS,
            OptionalHeader.GAIN,
            OptionalHeader.DESCRIPTION,
        ]
        
        const ORDERED_ALL_HEADERS = [
            ...orderedHeaders,
            ...ORDERED_OPT_HEADERS
        ]
  
        headers = ORDERED_ALL_HEADERS;
    } else {
        headers = orderedHeaders
    }
    let csv = createCsv(txns, headers, valueGetterFactory, validator)
    if (args.output) { 
        writeFileSync(args.output, csv)
    }
}

const parser = new ArgumentParser({
  description: 'Convert koinly to cointracker csv.'
});
 
parser.add_argument("files", { nargs: '+' })
parser.add_argument("-o", "--output", { help: "Name of output file" })
parser.add_argument("-x", "--extra", { action: "store_true", help: "Output extra information into csv. This will break Cointracker functionality." })
parser.add_argument("-t", "--type", { choices: Object.keys(OutputType), required: true, type: "str", help: "Specify output type, e.g., COIN_TRACKER" })

let args = parser.parse_args()
main(args)