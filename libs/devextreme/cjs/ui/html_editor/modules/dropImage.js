/**
 * DevExtreme (cjs/ui/html_editor/modules/dropImage.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _index = require("../../../events/utils/index");
var _iterator = require("../../../core/utils/iterator");
var _browser = _interopRequireDefault(require("../../../core/utils/browser"));
var _window = require("../../../core/utils/window");
var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
let DropImageModule = _base.default;
if (_devextremeQuill.default) {
    DropImageModule = class extends _base.default {
        constructor(quill, options) {
            super(quill, options);
            const widgetName = this.editorInstance.NAME;
            _events_engine.default.on(this.quill.root, (0, _index.addNamespace)("drop", widgetName), this._dropHandler.bind(this));
            _events_engine.default.on(this.quill.root, (0, _index.addNamespace)("paste", widgetName), this._pasteHandler.bind(this))
        }
        _dropHandler(e) {
            var _dataTransfer$files;
            const dataTransfer = e.originalEvent.dataTransfer;
            const hasFiles = null === dataTransfer || void 0 === dataTransfer || null === (_dataTransfer$files = dataTransfer.files) || void 0 === _dataTransfer$files ? void 0 : _dataTransfer$files.length;
            this.saveValueChangeEvent(e);
            e.preventDefault();
            if (hasFiles) {
                this._getImage(dataTransfer.files, this._addImage.bind(this))
            }
        }
        _pasteHandler(e) {
            var _clipboardData$items;
            const {
                clipboardData: clipboardData
            } = e.originalEvent;
            this.saveValueChangeEvent(e);
            if (!clipboardData) {
                return
            }
            const hasDataItems = null === (_clipboardData$items = clipboardData.items) || void 0 === _clipboardData$items ? void 0 : _clipboardData$items.length;
            const isHtmlData = clipboardData.getData("text/html");
            if (!isHtmlData && hasDataItems) {
                this._getImage(clipboardData.items, (imageData => {
                    if (_browser.default.mozilla) {
                        return
                    }
                    this._addImage(imageData)
                }))
            }
        }
        _isImage(file) {
            return !!file.type.match(/^image\/(a?png|bmp|gif|p?jpe?g|svg|vnd\.microsoft\.icon|webp)/i)
        }
        _getImage(files, callback) {
            const window = (0, _window.getWindow)();
            (0, _iterator.each)(files, ((index, file) => {
                if (!this._isImage(file)) {
                    return
                }
                const reader = new window.FileReader;
                reader.onload = _ref => {
                    let {
                        target: target
                    } = _ref;
                    callback(target.result)
                };
                const readableFile = file.getAsFile ? file.getAsFile() : file;
                if (readableFile instanceof window.Blob) {
                    reader.readAsDataURL(readableFile)
                }
            }))
        }
        _addImage(data) {
            const selection = this.quill.getSelection();
            const pasteIndex = selection ? selection.index : this.quill.getLength();
            this.quill.insertEmbed(pasteIndex, "extendedImage", data, "user")
        }
    }
}
var _default = exports.default = DropImageModule;
module.exports = exports.default;
module.exports.default = exports.default;
