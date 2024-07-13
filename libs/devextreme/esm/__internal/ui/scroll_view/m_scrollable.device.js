/**
 * DevExtreme (esm/__internal/ui/scroll_view/m_scrollable.device.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import devices from "../../../core/devices";
import {
    nativeScrolling,
    touch
} from "../../../core/utils/support";
export const deviceDependentOptions = function() {
    return [{
        device: () => !nativeScrolling,
        options: {
            useNative: false
        }
    }, {
        device: device => !devices.isSimulator() && "desktop" === devices.real().deviceType && "generic" === device.platform,
        options: {
            bounceEnabled: false,
            scrollByThumb: true,
            scrollByContent: touch,
            showScrollbar: "onHover"
        }
    }]
};
