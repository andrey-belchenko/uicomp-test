/**
 * DevExtreme (esm/__internal/grids/grid_core/keyboard_navigation/dom.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    ATTRIBUTES
} from "./const";
const isDragCell = $cell => void 0 !== $cell.attr(ATTRIBUTES.dragCell);
const getCellToFocus = ($cellElements, columnIndex) => $cellElements.filter(`[${ATTRIBUTES.ariaColIndex}="${columnIndex+1}"]:not([${ATTRIBUTES.dragCell}])`).first();
export const GridCoreKeyboardNavigationDom = {
    isDragCell: isDragCell,
    getCellToFocus: getCellToFocus
};
