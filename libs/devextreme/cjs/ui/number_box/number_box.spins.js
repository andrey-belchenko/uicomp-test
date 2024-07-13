/**
 * DevExtreme (cjs/ui/number_box/number_box.spins.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _button = _interopRequireDefault(require("../text_box/texteditor_button_collection/button"));
var _number_box = _interopRequireDefault(require("./number_box.spin"));
var _index = require("../../events/utils/index");
var _pointer = _interopRequireDefault(require("../../events/pointer"));
var _extend = require("../../core/utils/extend");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const SPIN_CLASS = "dx-numberbox-spin";
const SPIN_CONTAINER_CLASS = "dx-numberbox-spin-container";
const SPIN_TOUCH_FRIENDLY_CLASS = "dx-numberbox-spin-touch-friendly";
class SpinButtons extends _button.default {
    _attachEvents(instance, $spinContainer) {
        const {
            editor: editor
        } = this;
        const eventName = (0, _index.addNamespace)(_pointer.default.down, editor.NAME);
        const $spinContainerChildren = $spinContainer.children();
        const pointerDownAction = editor._createAction((e => editor._spinButtonsPointerDownHandler(e)));
        _events_engine.default.off($spinContainer, eventName);
        _events_engine.default.on($spinContainer, eventName, (e => pointerDownAction({
            event: e
        })));
        _number_box.default.getInstance($spinContainerChildren.eq(0)).option("onChange", (e => editor._spinUpChangeHandler(e)));
        _number_box.default.getInstance($spinContainerChildren.eq(1)).option("onChange", (e => editor._spinDownChangeHandler(e)))
    }
    _create() {
        const {
            editor: editor
        } = this;
        const $spinContainer = (0, _renderer.default)("<div>").addClass(SPIN_CONTAINER_CLASS);
        const $spinUp = (0, _renderer.default)("<div>").appendTo($spinContainer);
        const $spinDown = (0, _renderer.default)("<div>").appendTo($spinContainer);
        const options = this._getOptions();
        this._addToContainer($spinContainer);
        editor._createComponent($spinUp, _number_box.default, (0, _extend.extend)({
            direction: "up"
        }, options));
        editor._createComponent($spinDown, _number_box.default, (0, _extend.extend)({
            direction: "down"
        }, options));
        this._legacyRender(editor.$element(), this._isTouchFriendly(), options.visible);
        return {
            instance: $spinContainer,
            $element: $spinContainer
        }
    }
    _getOptions() {
        const {
            editor: editor
        } = this;
        const visible = this._isVisible();
        const disabled = editor.option("disabled");
        return {
            visible: visible,
            disabled: disabled
        }
    }
    _isVisible() {
        const {
            editor: editor
        } = this;
        return super._isVisible() && editor.option("showSpinButtons")
    }
    _isTouchFriendly() {
        const {
            editor: editor
        } = this;
        return editor.option("showSpinButtons") && editor.option("useLargeSpinButtons")
    }
    _legacyRender($editor, isTouchFriendly, isVisible) {
        $editor.toggleClass(SPIN_TOUCH_FRIENDLY_CLASS, isTouchFriendly);
        $editor.toggleClass(SPIN_CLASS, isVisible)
    }
    update() {
        const shouldUpdate = super.update();
        if (shouldUpdate) {
            const {
                editor: editor,
                instance: instance
            } = this;
            const $editor = editor.$element();
            const isVisible = this._isVisible();
            const isTouchFriendly = this._isTouchFriendly();
            const $spinButtons = instance.children();
            const spinUp = _number_box.default.getInstance($spinButtons.eq(0));
            const spinDown = _number_box.default.getInstance($spinButtons.eq(1));
            const options = this._getOptions();
            spinUp.option(options);
            spinDown.option(options);
            this._legacyRender($editor, isTouchFriendly, isVisible)
        }
    }
}
exports.default = SpinButtons;
module.exports = exports.default;
module.exports.default = exports.default;
