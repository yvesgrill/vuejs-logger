import {LogLevels} from "../enum/log-levels";

export interface IDummyLoggerOptions {
    logLevel: LogLevels,
    separator: string;
    showConsoleColors: boolean;
    showLogLevel: boolean;
    showMethodName: boolean;
    stringifyArguments: boolean;
}
