import { ArgumentParser } from "argparse";
import { OutputType } from "./enum/output-type.enum";
import { readFileSync, writeFileSync } from "fs";
import { ValueGetterFactoryProvider } from "./factory/value-getter.factory.provider";
import { OrderedHeadersFactory } from "./factory/ordered-headers-factory";
import { ValidatorFactory } from "./factory/validator-factory-provider";
import { Header } from "./type/header.type";
import { OptionalHeader } from "./enum/optional-header.enum";
import { createCsv } from "./koinly-to-cointracker-csv";


function main(args: any) {
    const outputType = OutputType[args.type as keyof typeof OutputType]
    const valueGetterFactory = new ValueGetterFactoryProvider().get(outputType)
    const orderedHeaders = OrderedHeadersFactory.get(outputType)
    const validator = new ValidatorFactory().get(outputType)
    

    let pages = JSON.parse(readFileSync(args.pages, 'utf8').toString())
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
    let csv = createCsv(pages, headers, valueGetterFactory, validator)
    if (args.output) { 
        writeFileSync(args.output, csv)
    }
}

const parser = new ArgumentParser({
  description: 'Convert koinly to cointracker csv.'
});
 
parser.add_argument("pages")
parser.add_argument("-o", "--output", { help: "Name of output file" })
parser.add_argument("-x", "--extra", { action: "store_true", help: "Output extra information into csv. This will break Cointracker functionality." })
parser.add_argument("-t", "--type", { choices: Object.keys(OutputType), required: true, type: "str", help: "Specify output type, e.g., cointracker" })

let args = parser.parse_args()
main(args)