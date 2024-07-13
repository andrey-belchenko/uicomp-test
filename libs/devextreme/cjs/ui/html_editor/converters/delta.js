/**
 * DevExtreme (cjs/ui/html_editor/converters/delta.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _converterController = _interopRequireDefault(require("../converterController"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
class DeltaConverter {
    setQuillInstance(quillInstance) {
        this.quillInstance = quillInstance
    }
    toHtml() {
        if (!this.quillInstance) {
            return
        }
        return this._isQuillEmpty() ? "" : this.quillInstance.getSemanticHTML(0, this.quillInstance.getLength() + 1)
    }
    _isQuillEmpty() {
        const delta = this.quillInstance.getContents();
        return 1 === delta.length() && this._isDeltaEmpty(delta)
    }
    _isDeltaEmpty(delta) {
        return delta.reduce(((__, _ref) => {
            let {
                insert: insert
            } = _ref;
            return -1 !== insert.indexOf("\n")
        }))
    }
}
_converterController.default.addConverter("delta", DeltaConverter);
var _default = exports.default = DeltaConverter;
module.exports = exports.default;
module.exports.default = exports.default;
