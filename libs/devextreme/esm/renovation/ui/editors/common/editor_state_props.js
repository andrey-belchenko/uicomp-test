/**
 * DevExtreme (esm/renovation/ui/editors/common/editor_state_props.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import devices from "../../../../core/devices";
export const EditorStateProps = {
    hoverStateEnabled: true,
    activeStateEnabled: true,
    get focusStateEnabled() {
        return "desktop" === devices.real().deviceType && !devices.isSimulator()
    }
};
