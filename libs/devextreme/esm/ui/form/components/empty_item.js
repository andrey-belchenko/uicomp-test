/**
 * DevExtreme (esm/ui/form/components/empty_item.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../../core/renderer";
export const FIELD_EMPTY_ITEM_CLASS = "dx-field-empty-item";
export function renderEmptyItem(_ref) {
    let {
        $parent: $parent,
        rootElementCssClassList: rootElementCssClassList
    } = _ref;
    return $("<div>").addClass("dx-field-empty-item").html("&nbsp;").addClass(rootElementCssClassList.join(" ")).appendTo($parent)
}
