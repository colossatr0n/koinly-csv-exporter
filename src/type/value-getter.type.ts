import { Transaction } from "../model/transaction.model";

export type ValueGetter<T> = (t: T) => any;  