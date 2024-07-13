/**
 * DevExtreme (cjs/ui/list/ui.list.edit.decorator.selection.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _click = require("../../events/click");
var _extend = require("../../core/utils/extend");
var _ui = _interopRequireDefault(require("../widget/ui.errors"));
var _check_box = _interopRequireDefault(require("../check_box"));
var _radio_button = _interopRequireDefault(require("../radio_group/radio_button"));
var _index = require("../../events/utils/index");
var _uiListEdit = require("./ui.list.edit.decorator_registry");
var _uiListEdit2 = _interopRequireDefault(require("./ui.list.edit.decorator"));
var _message = _interopRequireDefault(require("../../localization/message"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const SELECT_DECORATOR_ENABLED_CLASS = "dx-list-select-decorator-enabled";
const SELECT_DECORATOR_SELECT_ALL_CLASS = "dx-list-select-all";
const SELECT_DECORATOR_SELECT_ALL_CHECKBOX_CLASS = "dx-list-select-all-checkbox";
const SELECT_DECORATOR_SELECT_ALL_LABEL_CLASS = "dx-list-select-all-label";
const SELECT_CHECKBOX_CONTAINER_CLASS = "dx-list-select-checkbox-container";
const SELECT_CHECKBOX_CLASS = "dx-list-select-checkbox";
const SELECT_RADIO_BUTTON_CONTAINER_CLASS = "dx-list-select-radiobutton-container";
const SELECT_RADIO_BUTTON_CLASS = "dx-list-select-radiobutton";
const FOCUSED_STATE_CLASS = "dx-state-focused";
const CLICK_EVENT_NAME = (0, _index.addNamespace)(_click.name, "dxListEditDecorator");
const DEFAULT_SELECT_ALL_ARIA_LABEL = _message.default.format("dxList-selectAll");
(0, _uiListEdit.register)("selection", "default", _uiListEdit2.default.inherit({
    _init: function() {
        this.callBase.apply(this, arguments);
        const selectionMode = this._list.option("selectionMode");
        this._singleStrategy = "single" === selectionMode;
        this._containerClass = this._singleStrategy ? SELECT_RADIO_BUTTON_CONTAINER_CLASS : SELECT_CHECKBOX_CONTAINER_CLASS;
        this._controlClass = this._singleStrategy ? SELECT_RADIO_BUTTON_CLASS : SELECT_CHECKBOX_CLASS;
        this._controlWidget = this._singleStrategy ? _radio_button.default : _check_box.default;
        this._list.$element().addClass(SELECT_DECORATOR_ENABLED_CLASS)
    },
    beforeBag: function(config) {
        const $itemElement = config.$itemElement;
        const $container = config.$container.addClass(this._containerClass);
        const $control = (0, _renderer.default)("<div>").addClass(this._controlClass).appendTo($container);
        new this._controlWidget($control, (0, _extend.extend)(this._commonOptions(), {
            value: this._isSelected($itemElement),
            elementAttr: {
                "aria-label": "Check State"
            },
            focusStateEnabled: false,
            hoverStateEnabled: false,
            onValueChanged: function(e) {
                e.event && this._list._saveSelectionChangeEvent(e.event);
                this._processCheckedState($itemElement, e.value);
                e.event && e.event.stopPropagation()
            }.bind(this)
        }))
    },
    modifyElement: function(config) {
        this.callBase.apply(this, arguments);
        const $itemElement = config.$itemElement;
        const control = this._controlWidget.getInstance($itemElement.find("." + this._controlClass));
        _events_engine.default.on($itemElement, "stateChanged", function(e, state) {
            control.option("value", state)
        }.bind(this))
    },
    _updateSelectAllState: function() {
        if (!this._$selectAll) {
            return
        }
        this._selectAllCheckBox.option("value", this._list.isSelectAll())
    },
    afterRender: function() {
        if ("all" !== this._list.option("selectionMode")) {
            return
        }
        if (!this._$selectAll) {
            this._renderSelectAll()
        } else {
            this._updateSelectAllState()
        }
    },
    handleKeyboardEvents: function(currentFocusedIndex, moveFocusUp) {
        const moveFocusDown = !moveFocusUp;
        const list = this._list;
        const $selectAll = this._$selectAll;
        const lastItemIndex = list._getLastItemIndex();
        const isFocusOutOfList = moveFocusUp && 0 === currentFocusedIndex || moveFocusDown && currentFocusedIndex === lastItemIndex;
        const hasSelectAllItem = !!$selectAll;
        if (hasSelectAllItem && isFocusOutOfList) {
            list.option("focusedElement", $selectAll);
            list.scrollToItem(list.option("focusedElement"));
            return true
        }
        return false
    },
    handleEnterPressing: function(e) {
        if (this._$selectAll && this._$selectAll.hasClass("dx-state-focused")) {
            e.target = this._$selectAll.get(0);
            this._list._saveSelectionChangeEvent(e);
            this._selectAllCheckBox.option("value", !this._selectAllCheckBox.option("value"));
            return true
        }
    },
    _renderSelectAll() {
        this._$selectAll = (0, _renderer.default)("<div>").addClass("dx-list-select-all");
        const downArrowHandler = this._list._supportedKeys().downArrow.bind(this._list);
        const selectAllCheckBoxElement = (0, _renderer.default)("<div>").addClass("dx-list-select-all-checkbox").appendTo(this._$selectAll);
        this._selectAllCheckBox = this._list._createComponent(selectAllCheckBoxElement, _check_box.default, {
            elementAttr: {
                "aria-label": DEFAULT_SELECT_ALL_ARIA_LABEL
            },
            focusStateEnabled: false,
            hoverStateEnabled: false
        });
        this._selectAllCheckBox.registerKeyHandler("downArrow", downArrowHandler);
        (0, _renderer.default)("<div>").addClass("dx-list-select-all-label").text(this._list.option("selectAllText")).appendTo(this._$selectAll);
        this._list.itemsContainer().prepend(this._$selectAll);
        this._updateSelectAllState();
        this._updateSelectAllAriaLabel();
        this._attachSelectAllHandler()
    },
    _attachSelectAllHandler: function() {
        this._selectAllCheckBox.option("onValueChanged", this._selectAllHandler.bind(this));
        _events_engine.default.off(this._$selectAll, CLICK_EVENT_NAME);
        _events_engine.default.on(this._$selectAll, CLICK_EVENT_NAME, this._selectAllClickHandler.bind(this))
    },
    _updateSelectAllAriaLabel() {
        if (!this._$selectAll) {
            return
        }
        const {
            value: value
        } = this._selectAllCheckBox.option();
        const indeterminate = void 0 === value;
        const checkedText = indeterminate ? "half checked" : value ? "checked" : "not checked";
        const label = `${DEFAULT_SELECT_ALL_ARIA_LABEL}, ${checkedText}`;
        this._$selectAll.attr({
            "aria-label": label
        })
    },
    _selectAllHandler: function(e) {
        e.event && e.event.stopPropagation();
        e.event && this._list._saveSelectionChangeEvent(e.event);
        const {
            value: value
        } = this._selectAllCheckBox.option();
        if (value) {
            this._selectAllItems()
        } else if (false === value) {
            this._unselectAllItems()
        }
        this._updateSelectAllAriaLabel();
        this._list._createActionByOption("onSelectAllValueChanged")({
            value: value
        })
    },
    _checkSelectAllCapability: function() {
        const list = this._list;
        const dataController = list._dataController;
        if ("allPages" === list.option("selectAllMode") && list.option("grouped") && !dataController.group()) {
            _ui.default.log("W1010");
            return false
        }
        return true
    },
    _selectAllItems: function() {
        if (!this._checkSelectAllCapability()) {
            return
        }
        this._list._selection.selectAll("page" === this._list.option("selectAllMode"))
    },
    _unselectAllItems: function() {
        if (!this._checkSelectAllCapability()) {
            return
        }
        this._list._selection.deselectAll("page" === this._list.option("selectAllMode"))
    },
    _selectAllClickHandler: function(e) {
        this._list._saveSelectionChangeEvent(e);
        this._selectAllCheckBox.option("value", !this._selectAllCheckBox.option("value"))
    },
    _isSelected: function($itemElement) {
        return this._list.isItemSelected($itemElement)
    },
    _processCheckedState: function($itemElement, checked) {
        if (checked) {
            this._list.selectItem($itemElement)
        } else {
            this._list.unselectItem($itemElement)
        }
    },
    dispose: function() {
        this._disposeSelectAll();
        this._list.$element().removeClass(SELECT_DECORATOR_ENABLED_CLASS);
        this.callBase.apply(this, arguments)
    },
    _disposeSelectAll: function() {
        if (this._$selectAll) {
            this._$selectAll.remove();
            this._$selectAll = null
        }
    }
}));
