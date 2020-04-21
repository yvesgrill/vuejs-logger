import {strict, strictEqual} from "assert";
import VueLogging from "../src/index";
import {LogLevels} from "../src/enum/log-levels";
import {DummyLogger} from "../src//dummy/dummy-logger";

describe("isValidOptions()", () => {

    const logLevels = Object.keys(LogLevels).map((l) => l.toLowerCase());
    const logger = new DummyLogger();
    test("VueLogging.isValidOptions() should pass with correct options.", () => {
        const input = VueLogging.isValidOptions({
            logLevel: "debug",
            loggerFactory: {getInstance(name:string) {return logger;}}
        } as any, logLevels);
        strictEqual(input, true);
    });
    test("DummyLogger.isValidOptions() should pass with correct options.", () => {
        const input = DummyLogger.isValidOptions({
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: true,
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels);
        strictEqual(input, true);
    });
    test("VueLogging.isValidOptions() should fail with incorrect options.", () => {

        strictEqual(VueLogging.isValidOptions({
            logLevel: "debug",
            loggerFactory: null,
        } as any, logLevels), false);
        strictEqual(VueLogging.isValidOptions({
            logLevel: "debug",
            loggerFactory: new Object(),
        } as any, logLevels), false);
        strictEqual(VueLogging.isValidOptions({
            logLevel: "dummy",
            loggerFactory: new Object(),
        } as any, logLevels), false);
    });
    test("DummyLogger.isValidOptions() should fail with incorrect options.", () => {

        strictEqual(DummyLogger.isValidOptions({
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: true,
            separator: "|||||",
            showConsoleColors: false,
        } as any, logLevels), false);

        strictEqual(DummyLogger.isValidOptions({
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: true,
            separator: "|",
            showConsoleColors: "FOO",
        } as any, logLevels), false);

        strictEqual(DummyLogger.isValidOptions({
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: "TEST",
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels), false);

        strictEqual(DummyLogger.isValidOptions({
            logLevel: "debug",
            stringifyArguments: "TEST",
            showLogLevel: false,
            showMethodName: false,
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels), false);

        strictEqual(DummyLogger.isValidOptions({
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: "TEST",
            showMethodName: false,
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels), false);

        strictEqual(DummyLogger.isValidOptions({
            logLevel: "TEST",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: false,
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels), false);

        strictEqual(DummyLogger.isValidOptions({
            logLevel: "debug",
            isEnabled: true,
        } as any, logLevels), true);

        strictEqual(DummyLogger.isValidOptions({
            logLevel: "debug",
            separator: "1234",
        } as any, logLevels), false);

        strictEqual(DummyLogger.isValidOptions({
            logLevel: "debug",
            stringifyArguments: false,
            showLogLevel: false,
            showMethodName: false,
            separator: "|",
            showConsoleColors: false,
        } as any, logLevels), true);



    });
});
