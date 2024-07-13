/**
 * DevExtreme (cjs/ui/html_editor/modules/imageUpload.js)
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
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _type = require("../../../core/utils/type");
var _extend = require("../../../core/utils/extend");
var _image_uploader_helper = require("../utils/image_uploader_helper");
var _index = require("../../../events/utils/index");
var _file_uploader = _interopRequireDefault(require("../../file_uploader"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const MODULE_NAMESPACE = "dxHtmlEditorImageUpload";
const HIDDEN_FILE_UPLOADER_CLASS = "dx-htmleditor-hidden-content";
let ImageUploadModule = _base.default;
if (_devextremeQuill.default) {
    ImageUploadModule = class extends _base.default {
        constructor(quill, options) {
            super(quill, options);
            this.options = options;
            this._quillContainer = this.editorInstance._getQuillContainer();
            this.addCleanCallback(this.prepareCleanCallback());
            this._handleServerUpload()
        }
        _handleServerUpload() {
            const useServerUpload = (0, _type.isDefined)(this.options.fileUploadMode) && "base64" !== this.options.fileUploadMode;
            useServerUpload ? this._enableDragAndDropUploading() : this._disableDragAndDropUploading()
        }
        _getUploaderModule() {
            if (!this._uploaderModule) {
                this._uploaderModule = this.quill.getModule("uploader")
            }
            return this._uploaderModule
        }
        _disableDragAndDropUploading() {
            var _this$_fileUploader;
            this._getUploaderModule().preventImageUploading(false);
            this._detachEvents();
            null === (_this$_fileUploader = this._fileUploader) || void 0 === _this$_fileUploader || _this$_fileUploader.dispose()
        }
        _enableDragAndDropUploading() {
            this._initFileUploader();
            this._getUploaderModule().preventImageUploading(true);
            this._attachEvents()
        }
        _initFileUploader() {
            const $container = (0, _renderer.default)("<div>").addClass(HIDDEN_FILE_UPLOADER_CLASS).appendTo(this._quillContainer);
            const fileUploaderOptions = (0, _extend.extend)({}, (0, _image_uploader_helper.getFileUploaderBaseOptions)(), {
                uploadUrl: this.options.uploadUrl,
                onUploaded: this._onUploaded.bind(this)
            }, this.options.fileUploaderOptions);
            this._fileUploader = this.editorInstance._createComponent($container, _file_uploader.default, fileUploaderOptions);
            return $container
        }
        _onUploaded(data) {
            const {
                index: pasteIndex
            } = this.quill.getSelection() ?? {
                index: this.quill.getLength()
            };
            (0, _image_uploader_helper.serverUpload)(this.options.uploadDirectory, data.file.name, this.quill, pasteIndex)
        }
        _attachEvents() {
            _events_engine.default.on(this.quill.root, (0, _index.addNamespace)("drop", MODULE_NAMESPACE), this._dropHandler.bind(this));
            _events_engine.default.on(this.quill.root, (0, _index.addNamespace)("paste", MODULE_NAMESPACE), this._pasteHandler.bind(this))
        }
        _detachEvents() {
            _events_engine.default.off(this.quill.root, MODULE_NAMESPACE)
        }
        _dropHandler(e) {
            this._handleInsertImages(e, "dataTransfer")
        }
        _pasteHandler(e) {
            this._handleInsertImages(e, "clipboardData")
        }
        _handleInsertImages(e, filesField) {
            this.saveValueChangeEvent(e);
            const files = Array.from(e.originalEvent[filesField].files || []);
            const uploads = files;
            if (uploads.length) {
                e.preventDefault();
                e.stopPropagation();
                this._fileUploader.option("value", uploads);
                this._fileUploader.upload()
            }
        }
        clean() {
            this._disableDragAndDropUploading()
        }
        prepareCleanCallback() {
            return () => {
                this.clean()
            }
        }
        option(option, value) {
            switch (option) {
                case "imageUpload":
                    this.handleOptionChangeValue(value);
                    break;
                case "fileUploadMode":
                    this.options.fileUploadMode = value;
                    this._handleServerUpload();
                    break;
                case "fileUploaderOptions":
                    this._fileUploader.option(value)
            }
        }
    }
}
var _default = exports.default = ImageUploadModule;
module.exports = exports.default;
module.exports.default = exports.default;
