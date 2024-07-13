/**
 * DevExtreme (esm/ui/html_editor/themes/base.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import Quill from "devextreme-quill";
let BaseTheme;
if (Quill) {
    const Theme = Quill.import("core/theme");
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
export default BaseTheme;
