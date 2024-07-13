/**
 * DevExtreme (cjs/ui/popup/ui.popup.full.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
require("../toolbar");
var _ui = _interopRequireDefault(require("../popup/ui.popup"));
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _extend = require("../../core/utils/extend");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
class PopupFull extends _ui.default {
    _getDefaultOptions() {
        return (0, _extend.extend)(super._getDefaultOptions(), {
            preventScrollEvents: false
        })
    }
    _getToolbarName() {
        return "dxToolbar"
    }
}
exports.default = PopupFull;
PopupFull.defaultOptions = function(rule) {
    _ui.default.defaultOptions(rule)
};
(0, _component_registrator.default)("dxPopup", PopupFull);
module.exports = exports.default;
module.exports.default = exports.default;
