/**
 * DevExtreme (cjs/ui/html_editor/formats/variable.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
let Variable = {};
if (_devextremeQuill.default) {
    const Embed = _devextremeQuill.default.import("blots/embed");
    const VARIABLE_CLASS = "dx-variable";
    Variable = class extends Embed {
        static create(data) {
            const node = super.create();
            let startEscapeChar;
            let endEscapeChar;
            const text = data.value;
            if (Array.isArray(data.escapeChar)) {
                startEscapeChar = (0, _common.ensureDefined)(data.escapeChar[0], "");
                endEscapeChar = (0, _common.ensureDefined)(data.escapeChar[1], "")
            } else {
                startEscapeChar = endEscapeChar = data.escapeChar
            }
            node.innerText = startEscapeChar + text + endEscapeChar;
            node.dataset.varStartEscChar = startEscapeChar;
            node.dataset.varEndEscChar = endEscapeChar;
            node.dataset.varValue = data.value;
            return node
        }
        static value(node) {
            return (0, _extend.extend)({}, {
                value: node.dataset.varValue,
                escapeChar: [node.dataset.varStartEscChar || "", node.dataset.varEndEscChar || ""]
            })
        }
    };
    Variable.blotName = "variable";
    Variable.tagName = "span";
    Variable.className = VARIABLE_CLASS
}
var _default = exports.default = Variable;
module.exports = exports.default;
module.exports.default = exports.default;
