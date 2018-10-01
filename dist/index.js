'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var Cortado =
/*#__PURE__*/
function () {
  function Cortado() {
    var _this = this;

    _classCallCheck(this, Cortado);

    this.silent = !localStorage.getItem('turnLoggerOn');
    this.isProduction = process.env.NODE_ENV === 'production';
    this.timers = {};
    this.typeFilter = [];
    this.namespaceFilter = [];
    this.types = ['method', 'handler', 'xhr', 'ws', 'debug', 'lifecycle'];
    this.colors = {
      method: '#3671d1',
      handler: '#33b752',
      xhr: '#f2db0c',
      ws: '#29b9f2',
      debug: '#afafaf',
      lifecycle: '#ffad3a'
    };
    this.defaultLog = {
      label: 'Global',
      message: 'No message specified',
      type: 'debug',
      trace: false
    };

    this.shorthandFactory = function () {
      _this.types.forEach(function (type) {
        _this[type] = function (info) {
          if (typeof info === 'string') {
            return _this.log({
              message: info,
              type: type
            });
          }

          return _this.log(_objectSpread({}, info, {
            type: type
          }));
        };
      });
    };

    this.addNamespaceFilter = function (namespace) {
      return _this.namespaceFilter.push(namespace);
    };

    this.addTypeFilter = function (type) {
      return _this.typeFilter.push(type);
    };

    this.clearNamespaceFilters = function () {
      return _this.namespaceFilter = [];
    };

    this.clearTypeFilters = function () {
      return _this.typeFilter = [];
    };

    this.clearAllFilters = function () {
      _this.clearTypeFilters();

      _this.clearNamespaceFilters();
    };

    this.isPassingFilter = function (filters, value) {
      if (filters.length > 0) {
        return filters.indexOf(value) !== -1;
      }

      return true;
    };

    this.isPrivate = function (priv) {
      return priv && _this.isProduction;
    };

    this.filterMessage = function (info) {
      var isPassingFilter = _this.isPassingFilter,
          isPrivate = _this.isPrivate,
          namespaceFilter = _this.namespaceFilter,
          silent = _this.silent,
          typeFilter = _this.typeFilter;
      return !silent && isPassingFilter(namespaceFilter, info.label) && isPassingFilter(typeFilter, info.type) && !isPrivate(info.private);
    };

    this.addTimer = function (label) {
      var timers = _this.timers;

      if (timers.hasOwnProperty(label)) {
        var end = new Date().getTime();
        var diff = end - timers[label];
        timers[label] = end;
        return diff + 'ms';
      } else {
        timers[label] = new Date().getTime();
        return 'New timer started';
      }

      return null;
    };

    this.getTimer = function (label) {
      _this.log({
        label: label,
        message: "Current timer: ".concat(_this.timers[label], "ms")
      });
    };

    this.removeTimer = function (label) {
      var timers = _this.timers;

      if (label in timers) {
        delete timers[label];
      }
    };

    this.formatDefault = function (info) {
      var defaultLog = _this.defaultLog;
      return typeof info === 'string' ? _objectSpread({}, defaultLog, {
        message: info
      }) : _objectSpread({}, defaultLog, info);
    };

    this.formatter = function (info) {
      var label = info.label,
          message = info.message,
          trace = info.trace;
      return "%c[".concat(label, "] ").concat(message, " ").concat(trace ? '- ' + _this.addTimer(label) : '');
    };

    this.colorize = function (type) {
      var color = _this.colors[type] || _this.colors.debug;
      return "color: ".concat(color);
    };

    this.log = function (info) {
      var colorize = _this.colorize,
          formatter = _this.formatter,
          formatDefault = _this.formatDefault;
      info = formatDefault(info);

      if (_this.filterMessage(info)) {
        // eslint-disable-next-line no-console
        console.log(formatter(info), colorize(info.type));
      }
    };

    this.shorthandFactory();
  }

  _createClass(Cortado, [{
    key: "on",
    // Turn Logger on and off
    value: function on() {
      this.silent = false;
    }
  }, {
    key: "off",
    value: function off() {
      this.silent = true;
    }
  }, {
    key: "persist",
    value: function persist() {
      localStorage.setItem('turnLoggerOn', true);
      this.on();
    }
  }, {
    key: "halt",
    value: function halt() {
      localStorage.removeItem('turnLoggerOn');
      this.off();
    } // Filters

  }]);

  return Cortado;
}();

module.exports = EspLogger;
