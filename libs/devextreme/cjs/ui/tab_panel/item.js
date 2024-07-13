/**
 * DevExtreme (cjs/ui/tab_panel/item.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _item = _interopRequireDefault(require("../collection/item"));
var _common = require("../../core/utils/common");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
class TabPanelItem extends _item.default {
    _renderWatchers() {
        this._startWatcher("badge", _common.noop);
        return super._renderWatchers()
    }
}
exports.default = TabPanelItem;
module.exports = exports.default;
module.exports.default = exports.default;
