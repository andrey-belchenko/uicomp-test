/**
 * DevExtreme (cjs/ui/speed_dial_action/speed_dial_action.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _extend = require("../../core/utils/extend");
var _guid = _interopRequireDefault(require("../../core/guid"));
var _ready_callbacks = _interopRequireDefault(require("../../core/utils/ready_callbacks"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _speed_dial_main_item = require("./speed_dial_main_item");
var _swatch_container = _interopRequireDefault(require("../widget/swatch_container"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const {
    getSwatchContainer: getSwatchContainer
} = _swatch_container.default;
const ready = _ready_callbacks.default.add;
class SpeedDialAction extends _ui.default {
    _getDefaultOptions() {
        return (0, _extend.extend)(super._getDefaultOptions(), {
            icon: "",
            onClick: null,
            label: "",
            visible: true,
            index: 0,
            onContentReady: null,
            activeStateEnabled: true,
            hoverStateEnabled: true,
            animation: {
                show: {
                    type: "pop",
                    duration: 200,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    from: {
                        scale: 0,
                        opacity: 0
                    },
                    to: {
                        scale: 1,
                        opacity: 1
                    }
                },
                hide: {
                    type: "pop",
                    duration: 200,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    from: {
                        scale: 1,
                        opacity: 1
                    },
                    to: {
                        scale: 0,
                        opacity: 0
                    }
                }
            },
            id: new _guid.default
        })
    }
    _optionChanged(args) {
        switch (args.name) {
            case "onClick":
            case "icon":
            case "label":
            case "visible":
            case "index":
            case "onInitializing":
                (0, _speed_dial_main_item.initAction)(this);
                break;
            case "animation":
            case "id":
                break;
            default:
                super._optionChanged(args)
        }
    }
    _render() {
        this._toggleVisibility(false);
        if (!getSwatchContainer(this.$element())) {
            ready((() => (0, _speed_dial_main_item.initAction)(this)))
        } else {
            (0, _speed_dial_main_item.initAction)(this)
        }
    }
    _dispose() {
        (0, _speed_dial_main_item.disposeAction)(this._options.silent("id"));
        super._dispose()
    }
}(0, _component_registrator.default)("dxSpeedDialAction", SpeedDialAction);
var _default = exports.default = SpeedDialAction;
module.exports = exports.default;
module.exports.default = exports.default;
