/**
 * DevExtreme (cjs/ui/list/ui.list.edit.decorator_registry.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.register = register;
exports.registry = void 0;
var _extend = require("../../core/utils/extend");
const registry = exports.registry = {};

function register(option, type, decoratorClass) {
    const decoratorsRegistry = registry;
    const decoratorConfig = {};
    decoratorConfig[option] = decoratorsRegistry[option] ? decoratorsRegistry[option] : {};
    decoratorConfig[option][type] = decoratorClass;
    (0, _extend.extend)(decoratorsRegistry, decoratorConfig)
}
