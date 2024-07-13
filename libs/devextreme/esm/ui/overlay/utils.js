/**
 * DevExtreme (esm/ui/overlay/utils.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    getInnerHeight,
    getOuterHeight
} from "../../core/utils/size";
import $ from "../../core/renderer";
import {
    getWindow
} from "../../core/utils/window";
import {
    isNumeric
} from "../../core/utils/type";
const WINDOW_HEIGHT_PERCENT = .9;
export const getElementMaxHeightByWindow = ($element, startLocation) => {
    const $window = $(getWindow());
    const {
        top: elementOffset
    } = $element.offset();
    let actualOffset;
    if (isNumeric(startLocation)) {
        if (startLocation < elementOffset) {
            return elementOffset - startLocation
        } else {
            actualOffset = getInnerHeight($window) - startLocation + $window.scrollTop()
        }
    } else {
        const offsetTop = elementOffset - $window.scrollTop();
        const offsetBottom = getInnerHeight($window) - offsetTop - getOuterHeight($element);
        actualOffset = Math.max(offsetTop, offsetBottom)
    }
    return .9 * actualOffset
};
