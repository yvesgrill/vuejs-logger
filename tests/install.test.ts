import {notStrictEqual, strictEqual} from "assert";
import chai from "chai";
import Vue from "vue/dist/vue.min";
import VueLogging from "../src/index";
import {LogLevels} from "../src/enum/log-levels";
import {ILoggerOptions} from "../src/interfaces/logger-options";
import {IDummyLoggerOptions} from "../src/dummy/dummy-logger-options";
import {DummyLogger} from "../src/dummy/dummy-logger";
const expect = chai.expect;

describe("vue-logger.ts", () => {

    test("install() should work as expected with the correct params.", () => {
        const dummyOptions: IDummyLoggerOptions = {
            logLevel: LogLevels.FATAL,
            separator: "|",
            stringifyArguments: false,
            showConsoleColors: true,
            showLogLevel: false,
            showMethodName: false,
        };
        const logger = new DummyLogger(dummyOptions);
        const options: ILoggerOptions = {
            logLevel: LogLevels.FATAL,
            loggerFactory: { getInstance(name:string) {return logger;}}
        };
        Vue.use(VueLogging, options);
        expect(Vue.$log).to.be.a("object");
        strictEqual(Vue.$log.debug("debug"), undefined);
        strictEqual(Vue.$log.info("info"), undefined);
        strictEqual(Vue.$log.warn("warn"), undefined);
        strictEqual(Vue.$log.error("error"), undefined);
        expect(Vue.$log.fatal("fatal")).to.exist;
    });

    test("install() should throw an error with the an incorrect parameter.", () => {
        const dummyOptions: any = {
            logLevel: LogLevels.DEBUG,
            separator: "|",
            stringifyArguments: false,
            showConsoleColors: true,
            showLogLevel: false,
            showMethodName: "wrong value for test.",
        };
        const options: any = {
            logLevel: LogLevels.DEBUG,
            loggerFactory: null,
        };
        expect(() => {
            VueLogging.install(Vue, options);
        })
            .to
            .throw(Error, "Provided options for vuejs-logging are not valid.");
    });
});
