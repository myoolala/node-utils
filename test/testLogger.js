'use-strict';

const assert = require('assert');
const { Logger } = require("../index.js");

describe("Logger", () => {
  const makeConsoleMock = () => {
    const calls = { log: [], error: [] };
    return {
      calls,
      console: {
        log: (...args) => calls.log.push(args),
        error: (...args) => calls.error.push(args),
      },
    };
  };

  describe("constructor validation", () => {
    it("throws if logLevels is missing/empty", () => {
      assert.throws(
        () => new Logger({ logLevels: [] }),
        /Logger requires a non-empty 'levels' array/
      );
    });

    it("throws if errorLevels is missing/empty", () => {
      assert.throws(
        () => new Logger({ level: 'DEBUG', errorLevels: [] }),
        /Logger requires a non-empty 'levels' array/
      );
    });

    it("throws if initial level is unknown", () => {
      assert.throws(
        () => new Logger({ level: "NOT_A_LEVEL" }),
        /Unknown log level 'NOT_A_LEVEL'/
      );
    });

    it("creates methods for each configured level (log + error)", () => {
      const logger = new Logger({
        logLevels: ["DEBUG", "INFO"],
        errorLevels: ["ERROR", "CRITICAL"],
        level: "DEBUG",
      });

      assert.equal(typeof logger.debug, "function");
      assert.equal(typeof logger.info, "function");
      assert.equal(typeof logger.error, "function");
      assert.equal(typeof logger.critical, "function");
    });
  });

  describe("logging behavior", () => {
    it("does not log below the current threshold", () => {
      const { console, calls } = makeConsoleMock();
      const logger = new Logger({
        logLevels: ["DEBUG", "INFO", "WARN"],
        errorLevels: ["ERROR", "CRITICAL"],
        level: "WARN",
        console,
      });

      logger.info("should-not-log");
      logger.debug("also-no");

      assert.equal(calls.log.length, 0);
      assert.equal(calls.error.length, 0);
    });

    it("logs at or above the threshold using console.log for logLevels", () => {
      const { console, calls } = makeConsoleMock();
      const logger = new Logger({
        logLevels: ["DEBUG", "INFO", "WARN"],
        errorLevels: ["ERROR", "CRITICAL"],
        level: "INFO",
        console,
      });

      logger.info("hello", { a: 1 });
      logger.warn("warn!");

      assert.equal(calls.log.length, 2);
      assert.deepEqual(calls.log[0], ["INFO", "hello", { a: 1 }]);
      assert.deepEqual(calls.log[1], ["WARN", "warn!"]);
      assert.equal(calls.error.length, 0);
    });

    it("logs errorLevels using console.error when allowed by threshold", () => {
      const { console, calls } = makeConsoleMock();
      const logger = new Logger({
        logLevels: ["DEBUG", "INFO", "WARN"],
        errorLevels: ["ERROR", "CRITICAL"],
        level: "INFO",
        console,
      });

      logger.error("boom", 500);
      logger.critical("really bad");

      assert.equal(calls.log.length, 0);
      assert.equal(calls.error.length, 2);
      assert.deepEqual(calls.error[0], ["ERROR", "boom", 500]);
      assert.deepEqual(calls.error[1], ["CRITICAL", "really bad"]);
    });

    it("honors setLevel() for gating", () => {
      const { console, calls } = makeConsoleMock();
      const logger = new Logger({
        logLevels: ["DEBUG", "INFO", "WARN"],
        errorLevels: ["ERROR", "CRITICAL"],
        level: "DEBUG",
        console,
      });

      logger.debug("yes");
      logger.setLevel("ERROR");
      logger.warn("no");
      logger.error("yes-error");

      assert.equal(calls.log.length, 1);
      assert.deepEqual(calls.log[0], ["DEBUG", "yes"]);
      assert.equal(calls.error.length, 1);
      assert.deepEqual(calls.error[0], ["ERROR", "yes-error"]);
    });

    it("setLevel() throws for unknown levels", () => {
      const logger = new Logger({
        logLevels: ["DEBUG", "INFO", "WARN"],
        errorLevels: ["ERROR", "CRITICAL"],
        level: "INFO",
      });

      assert.throws(
        () => logger.setLevel("NOPE"),
        /Unknown log level 'NOPE'/
      );
    });
  });

  describe("shouldLog()", () => {
    it("returns false if the level is not present in provided list", () => {
      const logger = new Logger({
        logLevels: ["DEBUG", "INFO", "WARN"],
        errorLevels: ["ERROR"],
        level: "INFO",
      });

      assert.equal(logger.shouldLog("NOPE", ["DEBUG", "INFO"]), false);
    });

    it("returns true if level index >= current threshold index (as implemented)", () => {
      const logger = new Logger({
        logLevels: ["DEBUG", "INFO", "WARN"],
        errorLevels: ["ERROR", "CRITICAL"],
        level: "WARN",
      });

      // WARN should log, INFO should not (with threshold WARN)
      assert.equal(logger.shouldLog("WARN", logger.allLevels), true);
      assert.equal(logger.shouldLog("INFO", logger.allLevels), false);
      assert.equal(logger.shouldLog("ERROR", logger.allLevels), true);
    });
  });
});
