/**
 * DevExtreme (esm/ui/popup/popup_overflow_manager.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    getWindow,
    hasWindow
} from "../../core/utils/window";
import {
    isDefined
} from "../../core/utils/type";
import domAdapter from "../../core/dom_adapter";
import devices from "../../core/devices";
import {
    noop
} from "../../core/utils/common";
const overflowManagerMock = {
    setOverflow: noop,
    restoreOverflow: noop
};
export const createBodyOverflowManager = () => {
    if (!hasWindow()) {
        return overflowManagerMock
    }
    const window = getWindow();
    const documentElement = domAdapter.getDocument().documentElement;
    const body = domAdapter.getBody();
    const isIosDevice = "ios" === devices.real().platform;
    const prevSettings = {
        overflow: null,
        overflowX: null,
        overflowY: null,
        paddingRight: null,
        position: null,
        top: null,
        left: null
    };
    const setBodyPaddingRight = () => {
        const scrollBarWidth = window.innerWidth - documentElement.clientWidth;
        if (prevSettings.paddingRight || scrollBarWidth <= 0) {
            return
        }
        const paddingRight = window.getComputedStyle(body).getPropertyValue("padding-right");
        const computedBodyPaddingRight = parseInt(paddingRight, 10);
        prevSettings.paddingRight = computedBodyPaddingRight;
        body.style.setProperty("padding-right", `${computedBodyPaddingRight+scrollBarWidth}px`)
    };
    const restoreBodyPaddingRight = () => {
        if (!isDefined(prevSettings.paddingRight)) {
            return
        }
        if (prevSettings.paddingRight) {
            body.style.setProperty("padding-right", `${prevSettings.paddingRight}px`)
        } else {
            body.style.removeProperty("padding-right")
        }
        prevSettings.paddingRight = null
    };
    return {
        setOverflow: isIosDevice ? () => {
            if (isDefined(prevSettings.position) || "fixed" === body.style.position) {
                return
            }
            const {
                scrollY: scrollY,
                scrollX: scrollX
            } = window;
            prevSettings.position = body.style.position;
            prevSettings.top = body.style.top;
            prevSettings.left = body.style.left;
            body.style.setProperty("position", "fixed");
            body.style.setProperty("top", -scrollY + "px");
            body.style.setProperty("left", -scrollX + "px")
        } : () => {
            setBodyPaddingRight();
            if (prevSettings.overflow || "hidden" === body.style.overflow) {
                return
            }
            prevSettings.overflow = body.style.overflow;
            prevSettings.overflowX = body.style.overflowX;
            prevSettings.overflowY = body.style.overflowY;
            body.style.setProperty("overflow", "hidden")
        },
        restoreOverflow: isIosDevice ? () => {
            if (!isDefined(prevSettings.position)) {
                return
            }
            const scrollY = -parseInt(body.style.top, 10);
            const scrollX = -parseInt(body.style.left, 10);
            ["position", "top", "left"].forEach((property => {
                if (prevSettings[property]) {
                    body.style.setProperty(property, prevSettings[property])
                } else {
                    body.style.removeProperty(property)
                }
            }));
            window.scrollTo(scrollX, scrollY);
            prevSettings.position = null
        } : () => {
            restoreBodyPaddingRight();
            ["overflow", "overflowX", "overflowY"].forEach((property => {
                if (!isDefined(prevSettings[property])) {
                    return
                }
                const propertyInKebabCase = property.replace(/(X)|(Y)/, (symbol => `-${symbol.toLowerCase()}`));
                if (prevSettings[property]) {
                    body.style.setProperty(propertyInKebabCase, prevSettings[property])
                } else {
                    body.style.removeProperty(propertyInKebabCase)
                }
                prevSettings[property] = null
            }))
        }
    }
};
