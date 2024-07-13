/**
 * DevExtreme (esm/ui/drop_down_editor/utils.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    getOuterWidth
} from "../../core/utils/size";
import {
    hasWindow
} from "../../core/utils/window";
const getElementWidth = function($element) {
    if (hasWindow()) {
        return getOuterWidth($element)
    }
};
const getSizeValue = function(size) {
    if (null === size) {
        size = void 0
    }
    if ("function" === typeof size) {
        size = size()
    }
    return size
};
export {
    getElementWidth,
    getSizeValue
};
