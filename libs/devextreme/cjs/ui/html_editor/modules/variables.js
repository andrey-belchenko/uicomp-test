/**
 * DevExtreme (cjs/ui/html_editor/modules/variables.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _position = require("../../../core/utils/position");
var _popup = _interopRequireDefault(require("./popup"));
var _base = _interopRequireDefault(require("./base"));
var _variable = _interopRequireDefault(require("../formats/variable"));
var _extend = require("../../../core/utils/extend");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
let VariableModule = _base.default;
if (_devextremeQuill.default) {
    const VARIABLE_FORMAT_CLASS = "dx-variable-format";
    const ACTIVE_FORMAT_CLASS = "dx-format-active";
    const SELECTED_STATE_CLASS = "dx-state-selected";
    _devextremeQuill.default.register({
        "formats/variable": _variable.default
    }, true);
    VariableModule = class extends _popup.default {
        _getDefaultOptions() {
            const baseConfig = super._getDefaultOptions();
            return (0, _extend.extend)(baseConfig, {
                escapeChar: ""
            })
        }
        constructor(quill, options) {
            super(quill, options);
            const toolbar = quill.getModule("toolbar");
            if (toolbar) {
                toolbar.addClickHandler("variable", this.showPopup.bind(this))
            }
            quill.keyboard.addBinding({
                key: "P",
                altKey: true
            }, this.showPopup.bind(this));
            this._popup.on("shown", (e => {
                const $ofElement = (0, _renderer.default)(e.component.option("position").of);
                if ($ofElement.hasClass(VARIABLE_FORMAT_CLASS)) {
                    $ofElement.addClass(ACTIVE_FORMAT_CLASS);
                    $ofElement.addClass(SELECTED_STATE_CLASS)
                }
            }))
        }
        showPopup(event) {
            const selection = this.quill.getSelection(true);
            const position = selection ? selection.index : this.quill.getLength();
            this.savePosition(position);
            this._resetPopupPosition(event, position);
            super.showPopup()
        }
        _resetPopupPosition(event, position) {
            if (event && event.element) {
                this._popup.option("position", {
                    of: event.element,
                    offset: {
                        h: 0,
                        v: 0
                    },
                    my: "top center",
                    at: "bottom center",
                    collision: "fit"
                })
            } else {
                const mentionBounds = this.quill.getBounds(position);
                const rootRect = (0, _position.getBoundingRect)(this.quill.root);
                this._popup.option("position", {
                    of: this.quill.root,
                    offset: {
                        h: mentionBounds.left,
                        v: mentionBounds.bottom - rootRect.height
                    },
                    my: "top center",
                    at: "bottom left",
                    collision: "fit flip"
                })
            }
        }
        insertEmbedContent(selectionChangedEvent) {
            const caretPosition = this.getPosition();
            const selectedItem = selectionChangedEvent.component.option("selectedItem");
            const variableData = (0, _extend.extend)({}, {
                value: selectedItem,
                escapeChar: this.options.escapeChar
            });
            setTimeout(function() {
                this.quill.insertEmbed(caretPosition, "variable", variableData);
                this.quill.setSelection(caretPosition + 1)
            }.bind(this))
        }
    }
}
var _default = exports.default = VariableModule;
module.exports = exports.default;
module.exports.default = exports.default;
