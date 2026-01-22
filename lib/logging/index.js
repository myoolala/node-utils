// Logger.js
class Logger {
    /**
     * @param {object} opts
     * @param {string[]} opts.levels e.g. ['DEBUG','INFO','WARN','ERROR']
     * @param {string} opts.level   e.g. 'INFO'
     * @param {{log:Function, error:Function}} opts.console  injectable for unit tests
     */
    constructor({ logLevels = ['DEBUG', 'INFO', 'WARN'], errorLevels = ['ERROR', 'CRITICAL'], level, console: consoleImpl = console } = {}) {
      if (!Array.isArray(logLevels) || logLevels.length === 0 || !Array.isArray(errorLevels) || errorLevels.length === 0) {
        throw new Error("Logger requires a non-empty 'levels' array");
      }
  
      this.logLevels = logLevels;
      this.errorLevels = errorLevels;
      this.allLevels = this.logLevels.concat(this.errorLevels);
      this.level = level ?? this.logLevels[-1];
      this.console = consoleImpl;
  
      this.levelIndex = this.allLevels.indexOf(this.level);
      if (this.levelIndex === -1) {
        throw new Error(`Unknown log level '${this.level}'. Must be one of: ${this.allLevels.join(", ")}`);
      }
  
      // Create a method per level: logger.debug(), logger.info(), ...
      for (const lvl of this.logLevels) {
        const methodName = lvl.toLowerCase();
        this[methodName] = (...args) => this._log(lvl, this.console.log, args);
      }
  
      // Create a method per level: logger.debug(), logger.info(), ...
      for (const lvl of this.errorLevels) {
        const methodName = lvl.toLowerCase();
        this[methodName] = (...args) => this._log(lvl, this.console.error, args);
      }
    }
  
    setLevel(nextLevel) {
      const idx = this.allLevels.indexOf(nextLevel);
      if (idx === -1) {
        throw new Error(`Unknown log level '${nextLevel}'. Must be one of: ${this.logLevels.join(", ")}`);
      }
      this.level = nextLevel;
      this.levelIndex = idx;
    }
  
    shouldLog(level, levels) {
      const idx = levels.indexOf(level);
      if (idx === -1) return false;
      return idx >= this.levelIndex;
    }
  
    /**
     * Internal gated logger: console.log(level, ...args) if allowed.
     * @private
     */
    _log(level, loggingFunc, args) {
      if (this.shouldLog(level, this.allLevels)) {
        loggingFunc(level, ...args);
      }
    }
}
  
module.exports = {
    Logger: Logger
}