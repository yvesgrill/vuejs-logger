import chai from "chai";
import Vue from "vue/dist/vue.min";
import VueLogging from "../src/index";
import {LogLevels} from "../src/enum/log-levels";
import {ILoggerOptions} from "../src/interfaces/logger-options";
import log4javascript from "log4javascript";

const expect = chai.expect;

describe("output", () => {
    test("Should instantiate log functions and be reachable from external functions.", (done) => {
        const name = "test";
        const log = log4javascript.getLogger();
        var consoleAppender = new log4javascript.BrowserConsoleAppender();
        var popUpLayout = new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p - %m%n");
        consoleAppender.setLayout(popUpLayout);
        log.addAppender(consoleAppender);
    

        const options = {
            logLevel: LogLevels.DEBUG,
            loggerFactory: {getInstance(name:string) {
                console.log("Name"+name);
                if(name != null)
                    return log4javascript.getLogger(name);
                else
                    return log4javascript.getRootLogger();
            }}
        } as ILoggerOptions;

        Vue.use(VueLogging, options);
        const App = new Vue({
            created() {
                this.foo();
                done();
            },
            methods: {
                foo() {
                    expect(Vue.$log.fatal("test")).to.exist;
                    expect(Vue.$log.error("error")).to.exist;
                    expect(Vue.$log.warn("warn")).to.exist;
                    expect(Vue.$log.info("info")).to.exist;
                    expect(Vue.$log.debug("debug")).to.exist;
                    externalFunction();
                },
            },
        });

        function externalFunction(): void {
            expect(Vue.$log.fatal("test")).to.exist;
            expect(Vue.$log.fatal("test")).to.contains("externalFunction");
        }
    });
});
