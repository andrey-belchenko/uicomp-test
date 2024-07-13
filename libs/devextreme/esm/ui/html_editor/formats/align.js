/**
 * DevExtreme (esm/ui/html_editor/formats/align.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import Quill from "devextreme-quill";
let AlignStyle = {};
if (Quill) {
    AlignStyle = Quill.import("attributors/style/align");
    AlignStyle.whitelist.push("left")
}
export default AlignStyle;
