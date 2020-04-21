import {LogLevels} from "./enum/log-levels";
import {ILogger} from "./interfaces/logger";
import {ILoggerOptions} from "./interfaces/logger-options";
import {Interface} from "./interfaces/interface";
import {LoggerInterface} from "./interfaces/logger-interface";
import {DummyLogger} from "./dummy/dummy-logger";
import { ILoggerFactory } from "./interfaces/logger-factory";

class VueLogging implements ILogger {

    private errorMessage: string = "Provided options for vuejs-logging are not valid.";
    private logLevels: string[] = Object.keys(LogLevels).map((l) => l.toLowerCase());

    public install(Vue: any, options: ILoggerOptions) {
        options = Object.assign(this.getDefaultOptions(), options);

        if (this.isValidOptions(options, this.logLevels)) {
            Vue.$log = this.initLoggerInstance(options, this.logLevels);
            Vue.prototype.$log = Vue.$log;
            // Add `Vue.mixin()` to inject options to all components.
            Vue.mixin({
                // Add component lifecycle hooks or properties.
                created() {
                    if(this.$options.name != null) {
                        // Redefine the logger for vue component by 
                        // using component name has logger category.
                        this.$log = Vue.$log.getLogger(this.$options.name);
                    } 
                }
            });            
            this.initHandler(Vue);

        } else {
            throw new Error(this.errorMessage);
        }
    }

    public isValidOptions(options: ILoggerOptions, logLevels: string[]): boolean {
        if (!(options.logLevel && typeof options.logLevel === "string" && logLevels.indexOf(options.logLevel) > -1)) {
            return false;
        }
        if (options.loggerFactory == null ||  !("getInstance" in options.loggerFactory)) {
            return false;
        }
        let impl = options.loggerFactory.getInstance(name);
        try {
            Interface.checkImplements(impl, LoggerInterface)
            return true;                        
        } catch (error) {
            console.error(error);
            return false;            
        }
        return true;
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

    private initLoggerInstance(options: ILoggerOptions, logLevels: string[], name:string = null) {
        const self = this;
        let impl = options.loggerFactory.getInstance(name);
        try {
            Interface.checkImplements(impl, LoggerInterface)
        } catch (error) {
            console.error(error);
            return null;            
        }
        const logger = {
            name: name,
            impl: impl
        };
        logLevels.forEach((logLevel) => {
                if (logLevels.indexOf(logLevel) >= logLevels.indexOf(options.logLevel)) {
                    logger[logLevel] = (...args) => {
                        const methodName = this.getMethodName();
                        const methodNamePrefix = methodName + ` | `;
                        const logLevelPrefix =  logLevel + ` | `;
                        const formattedArguments =  args.map((a) => JSON.stringify(a)) ;
                        const logMessage = `${logLevelPrefix} ${methodNamePrefix}`;
                        logger.impl[logLevel](args);
                        return `${logMessage} ${formattedArguments.toString()}`;
                    };
                } else {
                    logger[logLevel] = () => undefined;
                }
            },
        );
        logger['getLogger'] = function(subname:string) {

            return self.initLoggerInstance(options, logLevels, (logger.name?logger.name+".":"")+subname);
        }
        return logger;
    }
    private initHandler(Vue: any) {
        const scope = this;
        window.onerror = (message, source, lineno, colno, err) => {
          if (err) Vue.$log.error({message:message, source:source, lineno:lineno, colno:colno, error:err});
        };
        Vue.config.errorHandler = (error, vm, info) => {
          // err: error trace
          // vm: component in which error occured
          // info: Vue specific error information such as lifecycle hooks, events etc.
          Vue.$log.error({error:error,component:vm,info:info});
        };
      }
    private getDefaultOptions(): ILoggerOptions {
        const logger = new DummyLogger();
        return {
            logLevel: LogLevels.DEBUG,
            loggerFactory: { getInstance(name:string) {return logger;}}
        };
    }
}

export default new VueLogging();
