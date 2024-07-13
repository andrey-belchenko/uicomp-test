/**
 * DevExtreme (cjs/ui/html_editor/themes/base.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
let BaseTheme;
if (_devextremeQuill.default) {
    const Theme = _devextremeQuill.default.import("core/theme");
    BaseTheme = class extends Theme {
        constructor(quill, options) {
            super(quill, options);
            this.quill.root.classList.add("dx-htmleditor-content");
            this.quill.root.setAttribute("role", "textbox");
            this.quill.root.setAttribute("aria-label", "Editor content")
        }
    }
} else {
    BaseTheme = {}
}
var _default = exports.default = BaseTheme;
module.exports = exports.default;
module.exports.default = exports.default;
