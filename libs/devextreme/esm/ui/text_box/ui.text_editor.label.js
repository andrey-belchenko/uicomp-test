/**
 * DevExtreme (esm/ui/text_box/ui.text_editor.label.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import Guid from "../../core/guid";
import {
    name as click
} from "../../events/click";
import eventsEngine from "../../events/core/events_engine";
import {
    addNamespace
} from "../../events/utils/index";
import {
    start as hoverStart
} from "../../events/hover";
import {
    active
} from "../../events/core/emitter.feedback";
import {
    getWindow
} from "../../core/utils/window";
import {
    getWidth
} from "../../core/utils/size";
const TEXTEDITOR_LABEL_CLASS = "dx-texteditor-label";
const TEXTEDITOR_WITH_LABEL_CLASS = "dx-texteditor-with-label";
const TEXTEDITOR_LABEL_OUTSIDE_CLASS = "dx-texteditor-label-outside";
const TEXTEDITOR_WITH_FLOATING_LABEL_CLASS = "dx-texteditor-with-floating-label";
const TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS = "dx-texteditor-with-before-buttons";
const LABEL_BEFORE_CLASS = "dx-label-before";
const LABEL_CLASS = "dx-label";
const LABEL_AFTER_CLASS = "dx-label-after";
class TextEditorLabel {
    constructor(props) {
        this.NAME = "dxLabel";
        this._props = props;
        this._id = `dx-texteditor-label-${new Guid}`;
        this._render();
        this._toggleMarkupVisibility()
    }
    _isVisible() {
        return !!this._props.text && "hidden" !== this._props.mode
    }
    _render() {
        this._$before = $("<div>").addClass("dx-label-before");
        this._$labelSpan = $("<span>");
        this._$label = $("<div>").addClass("dx-label").append(this._$labelSpan);
        this._$after = $("<div>").addClass("dx-label-after");
        this._$root = $("<div>").addClass("dx-texteditor-label").attr("id", this._id).append(this._$before).append(this._$label).append(this._$after);
        this._updateMark();
        this._updateText();
        this._updateBeforeWidth();
        this._updateMaxWidth()
    }
    _toggleMarkupVisibility() {
        const visible = this._isVisible();
        this._updateEditorBeforeButtonsClass(visible);
        this._updateEditorLabelClass(visible);
        visible ? this._$root.appendTo(this._props.$editor) : this._$root.detach();
        this._attachEvents()
    }
    _attachEvents() {
        const clickEventName = addNamespace(click, this.NAME);
        const hoverStartEventName = addNamespace(hoverStart, this.NAME);
        const activeEventName = addNamespace(active, this.NAME);
        eventsEngine.off(this._$labelSpan, clickEventName);
        eventsEngine.off(this._$labelSpan, hoverStartEventName);
        eventsEngine.off(this._$labelSpan, activeEventName);
        if (this._isVisible() && this._isOutsideMode()) {
            eventsEngine.on(this._$labelSpan, clickEventName, (e => {
                const selectedText = getWindow().getSelection().toString();
                if ("" === selectedText) {
                    this._props.onClickHandler();
                    e.preventDefault()
                }
            }));
            eventsEngine.on(this._$labelSpan, hoverStartEventName, (e => {
                this._props.onHoverHandler(e)
            }));
            eventsEngine.on(this._$labelSpan, activeEventName, (e => {
                this._props.onActiveHandler(e)
            }))
        }
    }
    _updateEditorLabelClass(visible) {
        this._props.$editor.removeClass("dx-texteditor-with-floating-label").removeClass("dx-texteditor-label-outside").removeClass("dx-texteditor-with-label");
        if (visible) {
            const labelClass = "floating" === this._props.mode ? "dx-texteditor-with-floating-label" : "dx-texteditor-with-label";
            this._props.$editor.addClass(labelClass);
            if (this._isOutsideMode()) {
                this._props.$editor.addClass("dx-texteditor-label-outside")
            }
        }
    }
    _isOutsideMode() {
        return "outside" === this._props.mode
    }
    _updateEditorBeforeButtonsClass() {
        let visible = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this._isVisible();
        this._props.$editor.removeClass("dx-texteditor-with-before-buttons");
        if (visible) {
            const beforeButtonsClass = this._props.containsButtonsBefore ? "dx-texteditor-with-before-buttons" : "";
            this._props.$editor.addClass(beforeButtonsClass)
        }
    }
    _updateMark() {
        this._$labelSpan.attr("data-mark", this._props.mark)
    }
    _updateText() {
        this._$labelSpan.text(this._props.text)
    }
    _updateBeforeWidth() {
        if (this._isVisible()) {
            const width = this._props.beforeWidth ?? this._props.getBeforeWidth();
            this._$before.css({
                width: width
            });
            this._updateLabelTransform()
        }
    }
    _updateLabelTransform() {
        let offset = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
        this._$labelSpan.css("transform", "");
        if (this._isVisible() && this._isOutsideMode()) {
            const sign = this._props.rtlEnabled ? 1 : -1;
            const labelTranslateX = sign * (getWidth(this._$before) + offset);
            this._$labelSpan.css("transform", `translateX(${labelTranslateX}px)`)
        }
    }
    _updateMaxWidth() {
        if (this._isVisible() && !this._isOutsideMode()) {
            const maxWidth = this._props.containerWidth ?? this._props.getContainerWidth();
            this._$label.css({
                maxWidth: maxWidth
            })
        }
    }
    $element() {
        return this._$root
    }
    isVisible() {
        return this._isVisible()
    }
    getId() {
        if (this._isVisible()) {
            return this._id
        }
    }
    updateMode(mode) {
        this._props.mode = mode;
        this._toggleMarkupVisibility();
        this._updateBeforeWidth();
        this._updateMaxWidth()
    }
    updateText(text) {
        this._props.text = text;
        this._updateText();
        this._toggleMarkupVisibility();
        this._updateBeforeWidth();
        this._updateMaxWidth()
    }
    updateMark(mark) {
        this._props.mark = mark;
        this._updateMark()
    }
    updateContainsButtonsBefore(containsButtonsBefore) {
        this._props.containsButtonsBefore = containsButtonsBefore;
        this._updateEditorBeforeButtonsClass()
    }
    updateBeforeWidth(beforeWidth) {
        this._props.beforeWidth = beforeWidth;
        this._updateBeforeWidth()
    }
    updateMaxWidth(containerWidth) {
        this._props.containerWidth = containerWidth;
        this._updateMaxWidth()
    }
}
export {
    TextEditorLabel
};
