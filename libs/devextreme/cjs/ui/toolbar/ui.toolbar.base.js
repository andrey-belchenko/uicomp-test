/**
 * DevExtreme (cjs/ui/toolbar/ui.toolbar.base.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _size = require("../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _themes = require("../themes");
var _type = require("../../core/utils/type");
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _position = require("../../core/utils/position");
var _uiCollection_widget = _interopRequireDefault(require("../collection/ui.collection_widget.async"));
var _bindable_template = require("../../core/templates/bindable_template");
var _fx = _interopRequireDefault(require("../../animation/fx"));
var _constants = require("./constants");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const TOOLBAR_BEFORE_CLASS = "dx-toolbar-before";
const TOOLBAR_CENTER_CLASS = "dx-toolbar-center";
const TOOLBAR_AFTER_CLASS = "dx-toolbar-after";
const TOOLBAR_MINI_CLASS = "dx-toolbar-mini";
const TOOLBAR_ITEM_CLASS = "dx-toolbar-item";
const TOOLBAR_LABEL_CLASS = "dx-toolbar-label";
const TOOLBAR_BUTTON_CLASS = "dx-toolbar-button";
const TOOLBAR_ITEMS_CONTAINER_CLASS = "dx-toolbar-items-container";
const TOOLBAR_GROUP_CLASS = "dx-toolbar-group";
const TOOLBAR_COMPACT_CLASS = "dx-toolbar-compact";
const TEXT_BUTTON_MODE = "text";
const DEFAULT_BUTTON_TYPE = "default";
const DEFAULT_DROPDOWNBUTTON_STYLING_MODE = "contained";
const TOOLBAR_ITEM_DATA_KEY = "dxToolbarItemDataKey";
const ANIMATION_TIMEOUT = 15;
class ToolbarBase extends _uiCollection_widget.default {
    _getSynchronizableOptionsForCreateComponent() {
        return super._getSynchronizableOptionsForCreateComponent().filter((item => "disabled" !== item))
    }
    _initTemplates() {
        super._initTemplates();
        const template = new _bindable_template.BindableTemplate(function($container, data, rawModel) {
            if ((0, _type.isPlainObject)(data)) {
                const {
                    text: text,
                    html: html,
                    widget: widget
                } = data;
                if (text) {
                    $container.text(text).wrapInner("<div>")
                }
                if (html) {
                    $container.html(html)
                }
                if ("dxDropDownButton" === widget) {
                    data.options = data.options ?? {};
                    if (!(0, _type.isDefined)(data.options.stylingMode)) {
                        data.options.stylingMode = this.option("useFlatButtons") ? "text" : "contained"
                    }
                }
                if ("dxButton" === widget) {
                    if (this.option("useFlatButtons")) {
                        data.options = data.options ?? {};
                        data.options.stylingMode = data.options.stylingMode ?? "text"
                    }
                    if (this.option("useDefaultButtons")) {
                        data.options = data.options ?? {};
                        data.options.type = data.options.type ?? "default"
                    }
                }
            } else {
                $container.text(String(data))
            }
            this._getTemplate("dx-polymorph-widget").render({
                container: $container,
                model: rawModel,
                parent: this
            })
        }.bind(this), ["text", "html", "widget", "options"], this.option("integrationOptions.watchMethod"));
        this._templateManager.addDefaultTemplates({
            item: template,
            menuItem: template
        })
    }
    _getDefaultOptions() {
        return (0, _extend.extend)(super._getDefaultOptions(), {
            renderAs: "topToolbar",
            grouped: false,
            useFlatButtons: false,
            useDefaultButtons: false
        })
    }
    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([{
            device: function() {
                return (0, _themes.isMaterialBased)()
            },
            options: {
                useFlatButtons: true
            }
        }])
    }
    _itemContainer() {
        return this._$toolbarItemsContainer.find([".dx-toolbar-before", ".dx-toolbar-center", ".dx-toolbar-after"].join(","))
    }
    _itemClass() {
        return "dx-toolbar-item"
    }
    _itemDataKey() {
        return TOOLBAR_ITEM_DATA_KEY
    }
    _dimensionChanged() {
        if (this._disposed) {
            return
        }
        this._arrangeItems();
        this._applyCompactMode()
    }
    _initMarkup() {
        this._renderToolbar();
        this._renderSections();
        super._initMarkup()
    }
    _render() {
        super._render();
        this._renderItemsAsync();
        this._updateDimensionsInMaterial()
    }
    _postProcessRenderItems() {
        this._arrangeItems()
    }
    _renderToolbar() {
        this.$element().addClass(_constants.TOOLBAR_CLASS);
        this._$toolbarItemsContainer = (0, _renderer.default)("<div>").addClass("dx-toolbar-items-container").appendTo(this.$element());
        this.setAria("role", "toolbar")
    }
    _renderSections() {
        const $container = this._$toolbarItemsContainer;
        (0, _iterator.each)(["before", "center", "after"], ((_, section) => {
            const sectionClass = `dx-toolbar-${section}`;
            const $section = $container.find(`.${sectionClass}`);
            if (!$section.length) {
                this[`_$${section}Section`] = (0, _renderer.default)("<div>").addClass(sectionClass).attr("role", "presentation").appendTo($container)
            }
        }))
    }
    _arrangeItems(elementWidth) {
        elementWidth = elementWidth ?? (0, _size.getWidth)(this.$element());
        this._$centerSection.css({
            margin: "0 auto",
            float: "none"
        });
        const beforeRect = (0, _position.getBoundingRect)(this._$beforeSection.get(0));
        const afterRect = (0, _position.getBoundingRect)(this._$afterSection.get(0));
        this._alignCenterSection(beforeRect, afterRect, elementWidth);
        const $label = this._$toolbarItemsContainer.find(".dx-toolbar-label").eq(0);
        const $section = $label.parent();
        if (!$label.length) {
            return
        }
        const labelOffset = beforeRect.width ? beforeRect.width : $label.position().left;
        const widthBeforeSection = $section.hasClass("dx-toolbar-before") ? 0 : labelOffset;
        const widthAfterSection = $section.hasClass("dx-toolbar-after") ? 0 : afterRect.width;
        let elemsAtSectionWidth = 0;
        $section.children().not(".dx-toolbar-label").each((function() {
            elemsAtSectionWidth += (0, _size.getOuterWidth)(this)
        }));
        const freeSpace = elementWidth - elemsAtSectionWidth;
        const sectionMaxWidth = Math.max(freeSpace - widthBeforeSection - widthAfterSection, 0);
        if ($section.hasClass("dx-toolbar-before")) {
            this._alignSection(this._$beforeSection, sectionMaxWidth)
        } else {
            const labelPaddings = (0, _size.getOuterWidth)($label) - (0, _size.getWidth)($label);
            $label.css("maxWidth", sectionMaxWidth - labelPaddings)
        }
    }
    _alignCenterSection(beforeRect, afterRect, elementWidth) {
        this._alignSection(this._$centerSection, elementWidth - beforeRect.width - afterRect.width);
        const isRTL = this.option("rtlEnabled");
        const leftRect = isRTL ? afterRect : beforeRect;
        const rightRect = isRTL ? beforeRect : afterRect;
        const centerRect = (0, _position.getBoundingRect)(this._$centerSection.get(0));
        if (leftRect.right > centerRect.left || centerRect.right > rightRect.left) {
            this._$centerSection.css({
                marginLeft: leftRect.width,
                marginRight: rightRect.width,
                float: leftRect.width > rightRect.width ? "none" : "right"
            })
        }
    }
    _alignSection($section, maxWidth) {
        const $labels = $section.find(".dx-toolbar-label");
        let labels = $labels.toArray();
        maxWidth -= this._getCurrentLabelsPaddings(labels);
        const currentWidth = this._getCurrentLabelsWidth(labels);
        const difference = Math.abs(currentWidth - maxWidth);
        if (maxWidth < currentWidth) {
            labels = labels.reverse();
            this._alignSectionLabels(labels, difference, false)
        } else {
            this._alignSectionLabels(labels, difference, true)
        }
    }
    _alignSectionLabels(labels, difference, expanding) {
        const getRealLabelWidth = function(label) {
            return (0, _position.getBoundingRect)(label).width
        };
        for (let i = 0; i < labels.length; i++) {
            const $label = (0, _renderer.default)(labels[i]);
            const currentLabelWidth = Math.ceil(getRealLabelWidth(labels[i]));
            let labelMaxWidth;
            if (expanding) {
                $label.css("maxWidth", "inherit")
            }
            const possibleLabelWidth = Math.ceil(expanding ? getRealLabelWidth(labels[i]) : currentLabelWidth);
            if (possibleLabelWidth < difference) {
                labelMaxWidth = expanding ? possibleLabelWidth : 0;
                difference -= possibleLabelWidth
            } else {
                labelMaxWidth = expanding ? currentLabelWidth + difference : currentLabelWidth - difference;
                $label.css("maxWidth", labelMaxWidth);
                break
            }
            $label.css("maxWidth", labelMaxWidth)
        }
    }
    _applyCompactMode() {
        const $element = this.$element();
        $element.removeClass("dx-toolbar-compact");
        if (this.option("compactMode") && this._getSummaryItemsSize("width", this.itemElements(), true) > (0, _size.getWidth)($element)) {
            $element.addClass("dx-toolbar-compact")
        }
    }
    _getCurrentLabelsWidth(labels) {
        let width = 0;
        labels.forEach((function(label, index) {
            width += (0, _size.getOuterWidth)(label)
        }));
        return width
    }
    _getCurrentLabelsPaddings(labels) {
        let padding = 0;
        labels.forEach((function(label, index) {
            padding += (0, _size.getOuterWidth)(label) - (0, _size.getWidth)(label)
        }));
        return padding
    }
    _renderItem(index, item, itemContainer, $after) {
        const location = item.location ?? "center";
        const container = itemContainer ?? this[`_$${location}Section`];
        const itemHasText = !!(item.text ?? item.html);
        const itemElement = super._renderItem(index, item, container, $after);
        itemElement.toggleClass("dx-toolbar-button", !itemHasText).toggleClass("dx-toolbar-label", itemHasText).addClass(item.cssClass);
        return itemElement
    }
    _renderGroupedItems() {
        (0, _iterator.each)(this.option("items"), ((groupIndex, group) => {
            const groupItems = group.items;
            const $container = (0, _renderer.default)("<div>").addClass("dx-toolbar-group");
            const location = group.location ?? "center";
            if (!groupItems || !groupItems.length) {
                return
            }(0, _iterator.each)(groupItems, ((itemIndex, item) => {
                this._renderItem(itemIndex, item, $container, null)
            }));
            this._$toolbarItemsContainer.find(`.dx-toolbar-${location}`).append($container)
        }))
    }
    _renderItems(items) {
        const grouped = this.option("grouped") && items.length && items[0].items;
        grouped ? this._renderGroupedItems() : super._renderItems(items)
    }
    _getToolbarItems() {
        return this.option("items") ?? []
    }
    _renderContentImpl() {
        const items = this._getToolbarItems();
        this.$element().toggleClass("dx-toolbar-mini", 0 === items.length);
        if (this._renderedItemsCount) {
            this._renderItems(items.slice(this._renderedItemsCount))
        } else {
            this._renderItems(items)
        }
        this._applyCompactMode()
    }
    _renderEmptyMessage() {}
    _clean() {
        this._$toolbarItemsContainer.children().empty();
        this.$element().empty();
        delete this._$beforeSection;
        delete this._$centerSection;
        delete this._$afterSection
    }
    _visibilityChanged(visible) {
        if (visible) {
            this._arrangeItems()
        }
    }
    _isVisible() {
        return (0, _size.getWidth)(this.$element()) > 0 && (0, _size.getHeight)(this.$element()) > 0
    }
    _getIndexByItem(item) {
        return this._getToolbarItems().indexOf(item)
    }
    _itemOptionChanged(item, property, value) {
        super._itemOptionChanged.apply(this, [item, property, value]);
        this._arrangeItems()
    }
    _optionChanged(_ref) {
        let {
            name: name,
            value: value
        } = _ref;
        switch (name) {
            case "width":
                super._optionChanged.apply(this, arguments);
                this._dimensionChanged();
                break;
            case "renderAs":
            case "useFlatButtons":
            case "useDefaultButtons":
                this._invalidate();
                break;
            case "compactMode":
                this._applyCompactMode();
                break;
            case "grouped":
                break;
            default:
                super._optionChanged.apply(this, arguments)
        }
    }
    _dispose() {
        super._dispose();
        clearTimeout(this._waitParentAnimationTimeout)
    }
    _updateDimensionsInMaterial() {
        if ((0, _themes.isMaterial)()) {
            const _waitParentAnimationFinished = () => new Promise((resolve => {
                const check = () => {
                    let readyToResolve = true;
                    this.$element().parents().each(((_, parent) => {
                        if (_fx.default.isAnimating((0, _renderer.default)(parent))) {
                            readyToResolve = false;
                            return false
                        }
                    }));
                    if (readyToResolve) {
                        resolve()
                    }
                    return readyToResolve
                };
                const runCheck = () => {
                    clearTimeout(this._waitParentAnimationTimeout);
                    this._waitParentAnimationTimeout = setTimeout((() => check() || runCheck()), 15)
                };
                runCheck()
            }));
            const _checkWebFontForLabelsLoaded = () => {
                const $labels = this.$element().find(".dx-toolbar-label");
                const promises = [];
                $labels.each(((_, label) => {
                    const text = (0, _renderer.default)(label).text();
                    const fontWeight = (0, _renderer.default)(label).css("fontWeight");
                    promises.push((0, _themes.waitWebFont)(text, fontWeight))
                }));
                return Promise.all(promises)
            };
            Promise.all([_waitParentAnimationFinished(), _checkWebFontForLabelsLoaded()]).then((() => {
                this._dimensionChanged()
            }))
        }
    }
}(0, _component_registrator.default)("dxToolbarBase", ToolbarBase);
var _default = exports.default = ToolbarBase;
module.exports = exports.default;
module.exports.default = exports.default;
