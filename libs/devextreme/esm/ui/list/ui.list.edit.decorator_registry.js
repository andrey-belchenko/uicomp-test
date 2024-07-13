/**
 * DevExtreme (esm/ui/list/ui.list.edit.decorator_registry.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    extend
} from "../../core/utils/extend";
export const registry = {};
export function register(option, type, decoratorClass) {
    const decoratorsRegistry = registry;
    const decoratorConfig = {};
    decoratorConfig[option] = decoratorsRegistry[option] ? decoratorsRegistry[option] : {};
    decoratorConfig[option][type] = decoratorClass;
    extend(decoratorsRegistry, decoratorConfig)
}
