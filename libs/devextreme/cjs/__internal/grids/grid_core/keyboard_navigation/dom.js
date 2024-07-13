/**
 * DevExtreme (cjs/__internal/grids/grid_core/keyboard_navigation/dom.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GridCoreKeyboardNavigationDom = void 0;
var _const = require("./const");
const isDragCell = $cell => void 0 !== $cell.attr(_const.ATTRIBUTES.dragCell);
const getCellToFocus = ($cellElements, columnIndex) => $cellElements.filter(`[${_const.ATTRIBUTES.ariaColIndex}="${columnIndex+1}"]:not([${_const.ATTRIBUTES.dragCell}])`).first();
const GridCoreKeyboardNavigationDom = exports.GridCoreKeyboardNavigationDom = {
    isDragCell: isDragCell,
    getCellToFocus: getCellToFocus
};
