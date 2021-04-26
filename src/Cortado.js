import { STATUS, LOG_TYPE, LOG_TYPE_COLOR, DEFAULT_LOG } from "./constants";

const initialState = {
  status: STATUS.OFF,
  typeFilter: [],
  namespaceFilter: [],
};

class Cortado {
  constructor() {
    let stateFromLocalStorage = localStorage.getItem("ESPRESSIVE_CORTADO");
    if (stateFromLocalStorage && typeof stateFromLocalStorage === "string") {
      stateFromLocalStorage = JSON.parse(stateFromLocalStorage);
    }

    this.state = stateFromLocalStorage || initialState;
    this.isProduction = process.env.NODE_ENV === "production";
    this.timers = {};

    // generate shothand methods
    Object.values(LOG_TYPE).forEach((type) => {
      this[type] = (info) => {
        if (typeof info === "string") {
          return this.log({ message: info, type });
        }
        return this.log({ ...info, type });
      };
    });
  }

  // Turn Logger on and off
  on() {
    this.persistStateToLocalStorage({
      ...this.state,
      status: STATUS.ON,
    });
  }

  off() {
    this.persistStateToLocalStorage({
      ...this.state,
      status: STATUS.OFF,
    });
  }

  // we are removing these...
  // persist() {
  //   localStorage.setItem('turnLoggerOn', true);
  //   this.on();
  // }

  // halt() {
  //   localStorage.removeItem('turnLoggerOn');
  //   this.off();
  // }

  // Filters

  addNamespaceFilter = (namespace) => {
    this.persistStateToLocalStorage({
      ...this.state,
      namespaceFilter: [...this.state.namespaceFilter, namespace],
    });
  };

  addTypeFilter = (type) => {
    this.persistStateToLocalStorage({
      ...this.state,
      typeFilter: [...this.state.typeFilter, type],
    });
  };

  clearNamespaceFilters = () => {
    this.persistStateToLocalStorage({
      ...this.state,
      namespaceFilter: [],
    });
  };

  clearTypeFilters = () => {
    this.persistStateToLocalStorage({
      ...this.state,
      typeFilter: [],
    });
  };

  clearAllFilters = () => {
    this.persistStateToLocalStorage({
      ...this.state,
      typeFilter: [],
      namespaceFilter: [],
    });
  };

  isPassingFilter = (filters, value) => {
    if (filters.length > 0) {
      return filters.indexOf(value) !== -1;
    }
    return true;
  };

  isPrivate = (priv) => priv && this.isProduction;

  filterMessage = (info) => {
    const { isPassingFilter, isPrivate, state } = this;

    return (
      state.status === STATUS.ON &&
      isPassingFilter(state.namespaceFilter, info.label) &&
      isPassingFilter(state.typeFilter, info.type) &&
      !isPrivate(info.private)
    );
  };

  // Timers
  addTimer = (label) => {
    const { timers } = this;
    if (timers.hasOwnProperty(label)) {
      const end = new Date().getTime();
      const diff = end - timers[label];
      timers[label] = end;
      return diff + "ms";
    } else {
      timers[label] = new Date().getTime();
      return "New timer started";
    }
  };

  getTimer = (label) => {
    this.log({
      label: label,
      message: `Current timer: ${this.timers[label]}ms`,
    });
  };

  removeTimer = (label) => {
    const { timers } = this;
    if (label in timers) {
      delete timers[label];
    }
  };

  // Formatting and printing
  formatDefault = (info) =>
    typeof info === "string"
      ? { ...DEFAULT_LOG, message: info }
      : { ...DEFAULT_LOG, ...info };

  formatter = (info) => {
    const { label, message, trace } = info;
    return `%c[${label}] ${message} ${
      trace ? "- " + this.addTimer(label) : ""
    }`;
  };

  colorize = (type) => {
    const color = LOG_TYPE_COLOR[type] || LOG_TYPE_COLOR.debug;
    return `color: ${color}`;
  };

  log = (info) => {
    const { colorize, formatter, formatDefault } = this;

    info = formatDefault(info);

    if (this.filterMessage(info)) {
      // eslint-disable-next-line no-console
      console.log(formatter(info), colorize(info.type));
    }
  };

  persistStateToLocalStorage = (newState) => {
    localStorage.setItem("ESPRESSIVE_CORTADO", JSON.stringify(newState));

    this.state = newState;
  };
}

export default Cortado;
