/**
 * DevExtreme (esm/ui/html_editor/utils/templates_storage.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    isDefined,
    isEmptyObject
} from "../../../core/utils/type";
export default class TemplatesStorage {
    constructor() {
        this._storage = {}
    }
    set(_ref, value) {
        var _this$_storage;
        let {
            editorKey: editorKey,
            marker: marker
        } = _ref;
        (_this$_storage = this._storage)[editorKey] ?? (_this$_storage[editorKey] = {});
        this._storage[editorKey][marker] = value
    }
    get(_ref2) {
        var _Object$values$at, _this$_storage$editor;
        let {
            editorKey: editorKey,
            marker: marker
        } = _ref2;
        const isQuillFormatCall = !isDefined(editorKey);
        return isQuillFormatCall ? null === (_Object$values$at = Object.values(this._storage).at(-1)) || void 0 === _Object$values$at ? void 0 : _Object$values$at[marker] : null === (_this$_storage$editor = this._storage[editorKey]) || void 0 === _this$_storage$editor ? void 0 : _this$_storage$editor[marker]
    }
    delete(_ref3) {
        let {
            editorKey: editorKey,
            marker: marker
        } = _ref3;
        if (!this._storage[editorKey]) {
            return
        }
        delete this._storage[editorKey][marker];
        if (isEmptyObject(this._storage[editorKey])) {
            delete this._storage[editorKey]
        }
    }
}
