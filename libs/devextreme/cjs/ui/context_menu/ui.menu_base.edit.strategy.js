/**
 * DevExtreme (cjs/ui/context_menu/ui.menu_base.edit.strategy.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _iterator = require("../../core/utils/iterator");
var _uiCollection_widgetEditStrategy = _interopRequireDefault(require("../collection/ui.collection_widget.edit.strategy.plain"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
class MenuBaseEditStrategy extends _uiCollection_widgetEditStrategy.default {
    _getPlainItems() {
        return (0, _iterator.map)(this._collectionWidget.option("items"), (function getMenuItems(item) {
            return item.items ? [item].concat((0, _iterator.map)(item.items, getMenuItems)) : item
        }))
    }
    _stringifyItem(item) {
        return JSON.stringify(item, ((key, value) => {
            if ("template" === key) {
                return this._getTemplateString(value)
            }
            return value
        }))
    }
    _getTemplateString(template) {
        let result;
        if ("object" === typeof template) {
            result = (0, _renderer.default)(template).text()
        } else {
            result = template.toString()
        }
        return result
    }
}
var _default = exports.default = MenuBaseEditStrategy;
module.exports = exports.default;
module.exports.default = exports.default;
