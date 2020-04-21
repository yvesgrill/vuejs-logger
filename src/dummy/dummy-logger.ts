import {LogLevels} from "../enum/log-levels";
import {IDummyLoggerOptions} from "./dummy-logger-options";

export class DummyLogger  {

    private errorMessage: string = "Provided options for dummy logger are not valid.";
    private logLevels: string[] = Object.keys(LogLevels).map((l) => l.toLowerCase());
    private options:IDummyLoggerOptions;
    constructor(options?:IDummyLoggerOptions) {
        this.options = Object.assign(this.getDefaultOptions(), options);
        if (!DummyLogger.isValidOptions(this.options, this.logLevels)) {
            throw new Error(this.errorMessage);
        }
    }
    public static isValidOptions(options: IDummyLoggerOptions, logLevels: string[]): boolean {
        if (!(options.logLevel && typeof options.logLevel === "string" && logLevels.indexOf(options.logLevel) > -1)) {
            return false;
        }
         if (options.stringifyArguments && typeof options.stringifyArguments !== "boolean") {
            return false;
        }
        if (options.showLogLevel && typeof options.showLogLevel !== "boolean") {
            return false;
        }
        if (options.showConsoleColors && typeof options.showConsoleColors !== "boolean") {
            return false;
        }
        if (options.separator && (typeof options.separator !== "string" || (typeof options.separator === "string" && options.separator.length > 3))) {
            return false;
        }
        return !(options.showMethodName && typeof options.showMethodName !== "boolean");
    }

    private getMethodName(): string {
        let error = {} as any;

        try {
            throw new Error("");
        } catch (e) {
            error = e;
        }
        // IE9 does not have .stack property
        if (error.stack === undefined) {
            return "";
        }
        let stackTrace = error.stack.split("\n")[3];
        if (/ /.test(stackTrace)) {
            stackTrace = stackTrace.trim().split(" ")[1];
        }
        if (stackTrace && stackTrace.indexOf(".") > -1) {
            stackTrace = stackTrace.split(".")[1];
        }
        return stackTrace;
    }
    public log(logLevel: LogLevels,...args) {
        const methodName = logLevel.toLowerCase();
        const methodNamePrefix = this.options.showMethodName ? methodName + ` ${this.options.separator} ` : "";
        const logLevelPrefix = this.options.showLogLevel ? logLevel + ` ${this.options.separator} ` : "";
        const formattedArguments = this.options.stringifyArguments ? args.map((a) => JSON.stringify(a)) : args;
        const logMessage = `${logLevelPrefix} ${methodNamePrefix}`;
        this.printLogMessage(logLevel, logMessage, this.options.showConsoleColors, formattedArguments);
    }
    public debug(...args) {
        this.log(LogLevels.DEBUG,args);
    }
    public info(...args) {
        this.log(LogLevels.INFO,args);
    }
    public warn(...args) {
        this.log(LogLevels.WARN,args);
    }
    public error(...args) {
        this.log(LogLevels.ERROR,args);
    }
    public fatal(...args) {
        this.log(LogLevels.FATAL,args);
    }
    // private initLoggerInstance(options: IDummyLoggerOptions, logLevels: string[]) {
    //     logLevels.forEach((logLevel) => {
    //         DummyLogger.prototype[logLevel] = (...args) => {
    //                     const methodName = this.getMethodName();
    //                     const methodNamePrefix = options.showMethodName ? methodName + ` ${options.separator} ` : "";
    //                     const logLevelPrefix = options.showLogLevel ? logLevel + ` ${options.separator} ` : "";
    //                     const formattedArguments = options.stringifyArguments ? args.map((a) => JSON.stringify(a)) : args;
    //                     const logMessage = `${logLevelPrefix} ${methodNamePrefix}`;
    //                     this.printLogMessage(logLevel, logMessage, options.showConsoleColors, formattedArguments);
    //                     return `${logMessage} ${formattedArguments.toString()}`;
    //                 };
    //         },
    //     );
    // }

    private printLogMessage(logLevel: string, logMessage: string, showConsoleColors: boolean, formattedArguments: any) {
        if (showConsoleColors && (logLevel === "warn" || logLevel === "error" || logLevel === "fatal")) {
            console[logLevel === "fatal" ? "error" : logLevel](logMessage, ...formattedArguments);
        } else {
            console.log(logMessage, ...formattedArguments);
        }
    }

    private getDefaultOptions(): IDummyLoggerOptions {
        return {
            logLevel: LogLevels.DEBUG,
            separator: "|",
            showConsoleColors: false,
            showLogLevel: false,
            showMethodName: false,
            stringifyArguments: false,
        };
    }
}

