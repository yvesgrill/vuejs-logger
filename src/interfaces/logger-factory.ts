import {ILoggerOptions} from "./logger-options";

export interface ILoggerFactory {
    getInstance(name: string):any;
}
