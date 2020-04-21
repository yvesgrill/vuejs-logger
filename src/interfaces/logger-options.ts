import {LogLevels} from "../enum/log-levels";
import { ILoggerFactory } from "./logger-factory";

export interface ILoggerOptions {
    logLevel: LogLevels;
    loggerFactory: ILoggerFactory;
}
