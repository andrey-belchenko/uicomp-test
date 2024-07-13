/**
 * DevExtreme (cjs/ui/html_editor/modules/tableContextMenu.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _base = _interopRequireDefault(require("./base"));
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _index = require("../../../events/utils/index");
var _context_menu = _interopRequireDefault(require("../../context_menu"));
var _message = _interopRequireDefault(require("../../../localization/message"));
var _table_helper = require("../utils/table_helper");
var _toolbar_helper = require("../utils/toolbar_helper");
var _iterator = require("../../../core/utils/iterator");
var _type = require("../../../core/utils/type");
var _inflector = require("../../../core/utils/inflector");
var _extend = require("../../../core/utils/extend");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const MODULE_NAMESPACE = "dxHtmlEditorTableContextMenu";
const CONTEXT_MENU_EVENT = (0, _index.addNamespace)("dxcontextmenu", MODULE_NAMESPACE);
let TableContextMenuModule = _base.default;
const localize = name => _message.default.format(`dxHtmlEditor-${(0,_inflector.camelize)(name)}`);
if (_devextremeQuill.default) {
    TableContextMenuModule = class extends _base.default {
        constructor(quill, options) {
            super(quill, options);
            this.enabled = !!options.enabled;
            this._quillContainer = this.editorInstance._getQuillContainer();
            this.addCleanCallback(this.prepareCleanCallback());
            this._formatHandlers = (0, _toolbar_helper.getFormatHandlers)(this);
            this._tableFormats = (0, _table_helper.getTableFormats)(quill);
            if (this.enabled) {
                this._enableContextMenu(options.items)
            }
        }
        _enableContextMenu(items) {
            var _this$_contextMenu;
            null === (_this$_contextMenu = this._contextMenu) || void 0 === _this$_contextMenu || _this$_contextMenu.dispose();
            this._contextMenu = this._createContextMenu(items);
            this._attachEvents()
        }
        _attachEvents() {
            _events_engine.default.on(this.editorInstance._getContent(), CONTEXT_MENU_EVENT, this._prepareContextMenuHandler())
        }
        _detachEvents() {
            _events_engine.default.off(this.editorInstance._getContent(), CONTEXT_MENU_EVENT)
        }
        _createContextMenu(items) {
            const $container = (0, _renderer.default)("<div>").appendTo(this.editorInstance.$element());
            const menuConfig = this._getMenuConfig(items);
            return this.editorInstance._createComponent($container, _context_menu.default, menuConfig)
        }
        showPropertiesForm() {
            let type = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "cell";
            const $element = (0, _renderer.default)(this._targetElement).closest("cell" === type ? "th, td" : "table");
            this._contextMenu.hide();
            this._formatHandlers[`${type}Properties`]($element);
            this._targetElement = null
        }
        _isAcceptableItem(widget, acceptableWidgetName) {
            return !widget || widget === acceptableWidgetName
        }
        _handleObjectItem(item) {
            if (item.name && this._isAcceptableItem(item.widget, "dxButton")) {
                const defaultButtonItemConfig = this._prepareMenuItemConfig(item.name);
                const buttonItemConfig = (0, _extend.extend)(true, defaultButtonItemConfig, item);
                return buttonItemConfig
            } else if (item.items) {
                item.items = this._prepareMenuItems(item.items);
                return item
            } else {
                return item
            }
        }
        _prepareMenuItemConfig(name) {
            const iconName = _toolbar_helper.ICON_MAP[name] ?? name;
            const buttonText = (0, _inflector.titleize)(name);
            return {
                text: localize(buttonText),
                icon: iconName.toLowerCase(),
                onClick: this._formatHandlers[name] ?? (0, _toolbar_helper.getDefaultClickHandler)(this, name)
            }
        }
        _prepareMenuItems(items) {
            const resultItems = [];
            (0, _iterator.each)(items, ((_, item) => {
                let newItem;
                if ((0, _type.isObject)(item)) {
                    newItem = this._handleObjectItem(item)
                } else if ((0, _type.isString)(item)) {
                    newItem = this._prepareMenuItemConfig(item)
                }
                if (newItem) {
                    resultItems.push(newItem)
                }
            }));
            return resultItems
        }
        _getMenuConfig(items) {
            const defaultItems = [{
                text: localize("insert"),
                items: ["insertHeaderRow", "insertRowAbove", "insertRowBelow", (0, _extend.extend)(this._prepareMenuItemConfig("insertColumnLeft"), {
                    beginGroup: true
                }), "insertColumnRight"]
            }, {
                text: localize("delete"),
                items: ["deleteColumn", "deleteRow", "deleteTable"]
            }, (0, _extend.extend)(this._prepareMenuItemConfig("cellProperties"), {
                onClick: e => {
                    this.showPropertiesForm("cell")
                }
            }), (0, _extend.extend)(this._prepareMenuItemConfig("tableProperties"), {
                onClick: e => {
                    this.showPropertiesForm("table")
                }
            })];
            const customItems = this._prepareMenuItems(null !== items && void 0 !== items && items.length ? items : defaultItems);
            return {
                target: this._quillContainer,
                showEvent: null,
                hideOnParentScroll: false,
                items: customItems
            }
        }
        _prepareContextMenuHandler() {
            return event => {
                if (this._isTableTarget(event.target)) {
                    this._targetElement = event.target;
                    this._setContextMenuPosition(event);
                    this._contextMenu.show();
                    event.preventDefault()
                }
            }
        }
        _setContextMenuPosition(event) {
            const startPosition = this._quillContainer.get(0).getBoundingClientRect();
            this._contextMenu.option({
                position: {
                    my: "left top",
                    at: "left top",
                    collision: "fit fit",
                    offset: {
                        x: event.clientX - startPosition.left,
                        y: event.clientY - startPosition.top
                    }
                }
            })
        }
        _isTableTarget(targetElement) {
            return !!(0, _renderer.default)(targetElement).closest(".dx-htmleditor-content td, .dx-htmleditor-content th").length
        }
        clean() {
            this._detachEvents()
        }
        option(option, value) {
            if ("tableContextMenu" === option) {
                this.handleOptionChangeValue(value);
                return
            }
            if ("enabled" === option) {
                this.enabled = value;
                value ? this._enableContextMenu() : this.clean()
            } else if ("items" === option) {
                var _this$_contextMenu2;
                null === (_this$_contextMenu2 = this._contextMenu) || void 0 === _this$_contextMenu2 || _this$_contextMenu2.dispose();
                this._contextMenu = this._createContextMenu(value)
            }
        }
        prepareCleanCallback() {
            return () => {
                this.clean()
            }
        }
    }
}
var _default = exports.default = TableContextMenuModule;
module.exports = exports.default;
module.exports.default = exports.default;
