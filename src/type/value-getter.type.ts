import { KoinlyTransaction } from "../model/transaction.model";

export type ValueGetter = (t: KoinlyTransaction) => any;  