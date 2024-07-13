/**
 * DevExtreme (esm/ui/html_editor/modules/base.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import Quill from "devextreme-quill";
import EmptyModule from "./empty";
import {
    isObject,
    isDefined
} from "../../../core/utils/type";
let BaseModule = EmptyModule;
if (Quill) {
    const BaseQuillModule = Quill.import("core/module");
    BaseModule = class extends BaseQuillModule {
        constructor(quill, options) {
            super(quill, options);
            this.editorInstance = options.editorInstance
        }
        saveValueChangeEvent(event) {
            this.editorInstance._saveValueChangeEvent(event)
        }
        addCleanCallback(callback) {
            this.editorInstance.addCleanCallback(callback)
        }
        handleOptionChangeValue(changes) {
            if (isObject(changes)) {
                Object.entries(changes).forEach((_ref => {
                    let [name, value] = _ref;
                    return this.option(name, value)
                }))
            } else if (!isDefined(changes)) {
                null === this || void 0 === this || this.clean()
            }
        }
    }
}
export default BaseModule;
