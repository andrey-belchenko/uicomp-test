/**
 * DevExtreme (cjs/ui/toolbar/ui.toolbar.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _extend = require("../../core/utils/extend");
var _uiToolbar = _interopRequireDefault(require("./ui.toolbar.base"));
var _uiToolbar2 = require("./ui.toolbar.utils");
var _toolbar = require("./strategy/toolbar.multiline");
var _toolbar2 = require("./strategy/toolbar.singleline");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const TOOLBAR_MULTILINE_CLASS = "dx-toolbar-multiline";
const TOOLBAR_AUTO_HIDE_TEXT_CLASS = "dx-toolbar-text-auto-hide";
class Toolbar extends _uiToolbar.default {
    _getDefaultOptions() {
        return (0, _extend.extend)(super._getDefaultOptions(), {
            menuItemTemplate: "menuItem",
            menuContainer: void 0,
            overflowMenuVisible: false,
            multiline: false
        })
    }
    _isMultiline() {
        return this.option("multiline")
    }
    _dimensionChanged(dimension) {
        if ("height" === dimension) {
            return
        }
        super._dimensionChanged();
        this._layoutStrategy._dimensionChanged()
    }
    _initMarkup() {
        super._initMarkup();
        this._updateFocusableItemsTabIndex();
        this._layoutStrategy._initMarkup()
    }
    _renderToolbar() {
        super._renderToolbar();
        this._renderLayoutStrategy()
    }
    _itemContainer() {
        if (this._isMultiline()) {
            return this._$toolbarItemsContainer
        }
        return super._itemContainer()
    }
    _renderLayoutStrategy() {
        this.$element().toggleClass("dx-toolbar-multiline", this._isMultiline());
        this._layoutStrategy = this._isMultiline() ? new _toolbar.MultiLineStrategy(this) : new _toolbar2.SingleLineStrategy(this)
    }
    _renderSections() {
        if (this._isMultiline()) {
            return
        }
        return super._renderSections()
    }
    _postProcessRenderItems() {
        this._layoutStrategy._hideOverflowItems();
        this._layoutStrategy._updateMenuVisibility();
        super._postProcessRenderItems();
        this._layoutStrategy._renderMenuItems()
    }
    _renderItem(index, item, itemContainer, $after) {
        const itemElement = super._renderItem(index, item, itemContainer, $after);
        this._layoutStrategy._renderItem(item, itemElement);
        const {
            widget: widget,
            showText: showText
        } = item;
        if ("dxButton" === widget && "inMenu" === showText) {
            itemElement.toggleClass("dx-toolbar-text-auto-hide")
        }
        return itemElement
    }
    _getItemsWidth() {
        return this._layoutStrategy._getItemsWidth()
    }
    _getMenuItems() {
        return this._layoutStrategy._getMenuItems()
    }
    _getToolbarItems() {
        return this._layoutStrategy._getToolbarItems()
    }
    _arrangeItems() {
        if (this.$element().is(":hidden")) {
            return
        }
        const elementWidth = this._layoutStrategy._arrangeItems();
        if (!this._isMultiline()) {
            super._arrangeItems(elementWidth)
        }
    }
    _itemOptionChanged(item, property, value) {
        if (!this._isMenuItem(item)) {
            super._itemOptionChanged(item, property, value)
        }
        this._layoutStrategy._itemOptionChanged(item, property, value);
        if ("disabled" === property || "options.disabled" === property) {
            (0, _uiToolbar2.toggleItemFocusableElementTabIndex)(this, item)
        }
        if ("location" === property) {
            this.repaint()
        }
    }
    _updateFocusableItemsTabIndex() {
        this._getToolbarItems().forEach((item => (0, _uiToolbar2.toggleItemFocusableElementTabIndex)(this, item)))
    }
    _isMenuItem(itemData) {
        return "menu" === itemData.location || "always" === itemData.locateInMenu
    }
    _isToolbarItem(itemData) {
        return void 0 === itemData.location || "never" === itemData.locateInMenu
    }
    _optionChanged(_ref) {
        let {
            name: name,
            value: value
        } = _ref;
        this._layoutStrategy._optionChanged(name, value);
        switch (name) {
            case "menuContainer":
            case "menuItemTemplate":
            case "overflowMenuVisible":
                break;
            case "multiline":
                this._invalidate();
                break;
            case "disabled":
                super._optionChanged.apply(this, arguments);
                this._updateFocusableItemsTabIndex();
                break;
            default:
                super._optionChanged.apply(this, arguments)
        }
    }
    updateDimensions() {
        this._dimensionChanged()
    }
}(0, _component_registrator.default)("dxToolbar", Toolbar);
var _default = exports.default = Toolbar;
module.exports = exports.default;
module.exports.default = exports.default;
