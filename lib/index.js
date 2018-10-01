'use strict';

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EspLogger = require('./EspLogger');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_EspLogger).default;
  }
});

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_interopRequireDefault, '_interopRequireDefault', '/Users/fernandosalas/Sites/Espressive/app_web/packages/esp-util-logging/es/index.js');
  leaveModule(module);
})();

;