class Cortado {
  silent = !localStorage.getItem('turnLoggerOn');
  isProduction = process.env.NODE_ENV === 'production';
  timers = {};
  typeFilter = [];
  namespaceFilter = [];
  types = ['method', 'handler', 'xhr', 'ws' , 'debug', 'lifecycle'];
  colors = {
    method    : '#3671d1',
    handler   : '#33b752',
    xhr       : '#f2db0c',
    ws        : '#29b9f2',
    debug     : '#afafaf',
    lifecycle : '#ffad3a',
  }
  defaultLog = {
    label   : 'Global',
    message : 'No message specified',
    type    : 'debug',
    trace   : false,
  }

  constructor() {
    this.shorthandFactory();
  }

  shorthandFactory = () => {
    this.types.forEach((type) => {
      this[type] = (info) => {
        if (typeof info === 'string') {
          return this.log({message: info,
            type});
        }
        return this.log({...info,
          type});
      };
    });
  }

  // Turn Logger on and off
  on() {
    this.silent = false;
  }
  off() {
    this.silent = true;
  }

  persist() {
    localStorage.setItem('turnLoggerOn', true);
    this.on();
  }

  halt() {
    localStorage.removeItem('turnLoggerOn');
    this.off();
  }

  // Filters

  addNamespaceFilter = (namespace) => this.namespaceFilter.push(namespace);

  addTypeFilter = (type) => this.typeFilter.push(type);

  clearNamespaceFilters = () => this.namespaceFilter = [];

  clearTypeFilters = () => this.typeFilter = [];

  clearAllFilters = () => {
    this.clearTypeFilters(); this.clearNamespaceFilters();
  };

  isPassingFilter = (filters, value) => {
    if (filters.length > 0) {
      return filters.indexOf(value) !== -1;
    }
    return true;
  }

  isPrivate = (priv) => priv && this.isProduction

  filterMessage = (info) => {
    const {isPassingFilter, isPrivate, namespaceFilter, silent, typeFilter} = this;

    return !silent &&
            isPassingFilter(namespaceFilter, info.label) &&
            isPassingFilter(typeFilter, info.type) &&
            !isPrivate(info.private);
  }

  // Timers
  addTimer = (label) => {
    const {timers} = this;
    if (timers.hasOwnProperty(label)) {
      const end = (new Date).getTime();
      const diff = end - timers[label];
      timers[label] = end;
      return diff + 'ms';
    }
    else {
      timers[label] = (new Date).getTime();
      return 'New timer started';
    }

    return null;
  }

  getTimer = (label) => {
    this.log({
      label   : label,
      message : `Current timer: ${this.timers[label]}ms`,
    });
  }

  removeTimer = (label) => {
    const {timers} = this;
    if (label in timers) {
      delete timers[label];
    }
  }

  // Formatting and printing
  formatDefault = (info) => {
    const {defaultLog} = this;
    return typeof info === 'string' ? {...defaultLog,
      message: info} : {...defaultLog,
      ...info};
  }
  formatter = (info) => {
    const {label, message, trace} = info;
    return `%c[${label}] ${message} ${trace ? '- ' + this.addTimer(label) : ''}`;
  }

  colorize = (type) => {
    const color = this.colors[type] || this.colors.debug;
    return `color: ${color}`;
  }

  log = (info) => {
    const {colorize, formatter, formatDefault} = this;

    info = formatDefault(info);

    if (this.filterMessage(info)) {
      // eslint-disable-next-line no-console
      console.log(formatter(info), colorize(info.type));
    }
  }

}

export default EspLogger;
