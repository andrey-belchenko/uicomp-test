/**
 * DevExtreme (esm/ui/html_editor/converterController.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
class ConverterController {
    constructor() {
        this._converters = {}
    }
    addConverter(name, converter) {
        this._converters[name] = converter
    }
    getConverter(name) {
        return this._converters[name]
    }
}
const controller = new ConverterController;
export default controller;
