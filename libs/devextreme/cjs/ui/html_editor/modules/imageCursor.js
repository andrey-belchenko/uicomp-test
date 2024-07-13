/**
 * DevExtreme (cjs/ui/html_editor/modules/imageCursor.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _base = _interopRequireDefault(require("./base"));
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _index = require("../../../events/utils/index");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const MODULE_NAMESPACE = "dxHtmlEditorImageCursor";
const clickEvent = (0, _index.addNamespace)("dxclick", MODULE_NAMESPACE);
let ImageCursorModule = _base.default;
if (_devextremeQuill.default) {
    ImageCursorModule = class extends _base.default {
        constructor(quill, options) {
            super(quill, options);
            this.addCleanCallback(this.clean.bind(this));
            this._attachEvents()
        }
        _attachEvents() {
            _events_engine.default.on(this.quill.root, clickEvent, this._clickHandler.bind(this))
        }
        _detachEvents() {
            _events_engine.default.off(this.quill.root, clickEvent)
        }
        _clickHandler(e) {
            if (this._isAllowedTarget(e.target)) {
                this._adjustSelection(e)
            }
        }
        _isAllowedTarget(targetElement) {
            return this._isImage(targetElement)
        }
        _isImage(targetElement) {
            return "IMG" === targetElement.tagName.toUpperCase()
        }
        _adjustSelection(e) {
            const blot = this.quill.scroll.find(e.target);
            if (blot) {
                const index = blot.offset(this.quill.scroll);
                this.quill.setSelection(index + 1, 0)
            } else {
                this.quill.setSelection(0, 0)
            }
        }
        clean() {
            this._detachEvents()
        }
    }
}
var _default = exports.default = ImageCursorModule;
module.exports = exports.default;
module.exports.default = exports.default;
