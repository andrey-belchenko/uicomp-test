/**
 * DevExtreme (esm/__internal/ui/date_box/m_date_box.mask.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import devices from "../../../core/devices";
import browser from "../../../core/utils/browser";
import {
    clipboardText
} from "../../../core/utils/dom";
import {
    extend
} from "../../../core/utils/extend";
import {
    fitIntoRange,
    inRange,
    sign
} from "../../../core/utils/math";
import {
    isDate,
    isDefined,
    isFunction,
    isString
} from "../../../core/utils/type";
import eventsEngine from "../../../events/core/events_engine";
import {
    addNamespace,
    isCommandKeyPressed,
    normalizeKeyName
} from "../../../events/utils/index";
import dateLocalization from "../../../localization/date";
import defaultDateNames from "../../../localization/default_date_names";
import {
    getFormat
} from "../../../localization/ldml/date.format";
import {
    getRegExpInfo
} from "../../../localization/ldml/date.parser";
import numberLocalization from "../../../localization/number";
import DateBoxBase from "./m_date_box.base";
import {
    getDatePartIndexByPosition,
    renderDateParts
} from "./m_date_box.mask.parts";
const MASK_EVENT_NAMESPACE = "dateBoxMask";
const FORWARD = 1;
const BACKWARD = -1;
const DateBoxMask = DateBoxBase.inherit({
    _supportedKeys(e) {
        const originalHandlers = this.callBase(e);
        const callOriginalHandler = e => {
            const originalHandler = originalHandlers[normalizeKeyName(e)];
            return originalHandler && originalHandler.apply(this, [e])
        };
        const applyHandler = (e, maskHandler) => {
            if (this._shouldUseOriginalHandler(e)) {
                return callOriginalHandler.apply(this, [e])
            }
            return maskHandler.apply(this, [e])
        };
        return extend({}, originalHandlers, {
            del: e => applyHandler(e, (event => {
                this._revertPart(1);
                this._isAllSelected() || event.preventDefault()
            })),
            backspace: e => applyHandler(e, (event => {
                this._revertPart(-1);
                this._isAllSelected() || event.preventDefault()
            })),
            home: e => applyHandler(e, (event => {
                this._selectFirstPart();
                event.preventDefault()
            })),
            end: e => applyHandler(e, (event => {
                this._selectLastPart();
                event.preventDefault()
            })),
            escape: e => applyHandler(e, (event => {
                this._revertChanges(event)
            })),
            enter: e => applyHandler(e, (() => {
                this._enterHandler()
            })),
            leftArrow: e => applyHandler(e, (event => {
                this._selectNextPart(-1);
                event.preventDefault()
            })),
            rightArrow: e => applyHandler(e, (event => {
                this._selectNextPart(1);
                event.preventDefault()
            })),
            upArrow: e => applyHandler(e, (event => {
                this._upDownArrowHandler(1);
                event.preventDefault()
            })),
            downArrow: e => applyHandler(e, (event => {
                this._upDownArrowHandler(-1);
                event.preventDefault()
            }))
        })
    },
    _shouldUseOriginalHandler(e) {
        const isNotDeletingInCalendar = this.option("opened") && e && !["backspace", "del"].includes(normalizeKeyName(e));
        return !this._useMaskBehavior() || isNotDeletingInCalendar || e && e.altKey
    },
    _upDownArrowHandler(step) {
        this._setNewDateIfEmpty();
        const originalValue = this._getActivePartValue(this._initialMaskValue);
        const currentValue = this._getActivePartValue();
        const delta = currentValue - originalValue;
        this._loadMaskValue(this._initialMaskValue);
        this._changePartValue(delta + step, true)
    },
    _changePartValue(step, lockOtherParts) {
        const activePartPattern = this._getActivePartProp("pattern");
        const isAmPmPartActive = /^a{1,5}$/.test(activePartPattern);
        if (isAmPmPartActive) {
            this._toggleAmPm()
        } else {
            this._partIncrease(step, lockOtherParts)
        }
    },
    _toggleAmPm() {
        const currentValue = this._getActivePartProp("text");
        const indexOfCurrentValue = defaultDateNames.getPeriodNames().indexOf(currentValue);
        const newValue = 1 ^ indexOfCurrentValue;
        this._setActivePartValue(newValue)
    },
    _getDefaultOptions() {
        return extend(this.callBase(), {
            useMaskBehavior: false,
            emptyDateValue: new Date(2e3, 0, 1, 0, 0, 0)
        })
    },
    _isSingleCharKey(_ref) {
        let {
            originalEvent: originalEvent,
            alt: alt
        } = _ref;
        const key = originalEvent.data || originalEvent.key;
        return "string" === typeof key && 1 === key.length && !alt && !isCommandKeyPressed(originalEvent)
    },
    _isSingleDigitKey(e) {
        var _e$originalEvent;
        const data = null === (_e$originalEvent = e.originalEvent) || void 0 === _e$originalEvent ? void 0 : _e$originalEvent.data;
        return 1 === (null === data || void 0 === data ? void 0 : data.length) && parseInt(data, 10)
    },
    _useBeforeInputEvent: () => devices.real().android,
    _keyInputHandler(e, key) {
        const oldInputValue = this._input().val();
        this._processInputKey(key);
        e.preventDefault();
        const isValueChanged = oldInputValue !== this._input().val();
        isValueChanged && eventsEngine.trigger(this._input(), "input")
    },
    _keyboardHandler(e) {
        let {
            key: key
        } = e.originalEvent;
        const result = this.callBase(e);
        if (!this._useMaskBehavior() || this._useBeforeInputEvent()) {
            return result
        }
        if (browser.chrome && "Process" === e.key && 0 === e.code.indexOf("Digit")) {
            key = e.code.replace("Digit", "");
            this._processInputKey(key);
            this._maskInputHandler = () => {
                this._renderSelectedPart()
            }
        } else if (this._isSingleCharKey(e)) {
            this._keyInputHandler(e.originalEvent, key)
        }
        return result
    },
    _maskBeforeInputHandler(e) {
        this._maskInputHandler = null;
        const {
            inputType: inputType
        } = e.originalEvent;
        if ("insertCompositionText" === inputType) {
            this._maskInputHandler = () => {
                this._renderSelectedPart()
            }
        }
        const isBackwardDeletion = "deleteContentBackward" === inputType;
        const isForwardDeletion = "deleteContentForward" === inputType;
        if (isBackwardDeletion || isForwardDeletion) {
            const direction = isBackwardDeletion ? -1 : 1;
            this._maskInputHandler = () => {
                this._revertPart();
                this._selectNextPart(direction)
            }
        }
        if (!this._useMaskBehavior() || !this._isSingleCharKey(e)) {
            return
        }
        const key = e.originalEvent.data;
        this._keyInputHandler(e, key);
        return true
    },
    _keyPressHandler(e) {
        const {
            originalEvent: event
        } = e;
        if ("insertCompositionText" === (null === event || void 0 === event ? void 0 : event.inputType) && this._isSingleDigitKey(e)) {
            this._processInputKey(event.data);
            this._renderDisplayText(this._getDisplayedText(this._maskValue));
            this._selectNextPart()
        }
        this.callBase(e);
        if (this._maskInputHandler) {
            this._maskInputHandler();
            this._maskInputHandler = null
        }
    },
    _processInputKey(key) {
        if (this._isAllSelected()) {
            this._activePartIndex = 0
        }
        this._setNewDateIfEmpty();
        if (isNaN(parseInt(key))) {
            this._searchString(key)
        } else {
            this._searchNumber(key)
        }
    },
    _isAllSelected() {
        const caret = this._caret();
        return caret.end - caret.start === this.option("text").length
    },
    _getFormatPattern() {
        if (this._formatPattern) {
            return this._formatPattern
        }
        const format = this._strategy.getDisplayFormat(this.option("displayFormat"));
        const isLDMLPattern = isString(format) && !dateLocalization._getPatternByFormat(format);
        if (isLDMLPattern) {
            this._formatPattern = format
        } else {
            this._formatPattern = getFormat((value => dateLocalization.format(value, format)))
        }
        return this._formatPattern
    },
    _setNewDateIfEmpty() {
        if (!this._maskValue) {
            const value = "time" === this.option("type") ? new Date(null) : new Date;
            this._maskValue = value;
            this._initialMaskValue = value;
            this._renderDateParts()
        }
    },
    _partLimitsReached(max) {
        const maxLimitLength = String(max).length;
        const formatLength = this._getActivePartProp("pattern").length;
        const isShortFormat = 1 === formatLength;
        const maxSearchLength = isShortFormat ? maxLimitLength : Math.min(formatLength, maxLimitLength);
        const isLengthExceeded = this._searchValue.length === maxSearchLength;
        const isValueOverflowed = parseInt(`${this._searchValue}0`) > max;
        return isLengthExceeded || isValueOverflowed
    },
    _searchNumber(char) {
        const {
            max: max
        } = this._getActivePartLimits();
        const maxLimitLength = String(max).length;
        this._searchValue = (this._searchValue + char).substr(-maxLimitLength);
        if (isNaN(this._searchValue)) {
            this._searchValue = char
        }
        this._setActivePartValue(this._searchValue);
        if (this._partLimitsReached(max)) {
            this._selectNextPart(1)
        }
    },
    _searchString(char) {
        if (!isNaN(parseInt(this._getActivePartProp("text")))) {
            return
        }
        const limits = this._getActivePartProp("limits")(this._maskValue);
        const startString = this._searchValue + char.toLowerCase();
        const endLimit = limits.max - limits.min;
        for (let i = 0; i <= endLimit; i++) {
            this._loadMaskValue(this._initialMaskValue);
            this._changePartValue(i + 1);
            if (0 === this._getActivePartProp("text").toLowerCase().indexOf(startString)) {
                this._searchValue = startString;
                return
            }
        }
        this._setNewDateIfEmpty();
        if (this._searchValue) {
            this._clearSearchValue();
            this._searchString(char)
        }
    },
    _clearSearchValue() {
        this._searchValue = ""
    },
    _revertPart(direction) {
        if (!this._isAllSelected()) {
            const actual = this._getActivePartValue(this.option("emptyDateValue"));
            this._setActivePartValue(actual);
            this._selectNextPart(direction)
        }
        this._clearSearchValue()
    },
    _useMaskBehavior() {
        return this.option("useMaskBehavior") && "text" === this.option("mode")
    },
    _prepareRegExpInfo() {
        this._regExpInfo = getRegExpInfo(this._getFormatPattern(), dateLocalization);
        const {
            regexp: regexp
        } = this._regExpInfo;
        const {
            source: source
        } = regexp;
        const {
            flags: flags
        } = regexp;
        const quantifierRegexp = new RegExp(/(\{[0-9]+,?[0-9]*\})/);
        const convertedSource = source.split(quantifierRegexp).map((sourcePart => quantifierRegexp.test(sourcePart) ? sourcePart : numberLocalization.convertDigits(sourcePart, false))).join("");
        this._regExpInfo.regexp = new RegExp(convertedSource, flags)
    },
    _initMaskState() {
        this._activePartIndex = 0;
        this._formatPattern = null;
        this._prepareRegExpInfo();
        this._loadMaskValue()
    },
    _renderMask() {
        this.callBase();
        this._detachMaskEvents();
        this._clearMaskState();
        if (this._useMaskBehavior()) {
            this._attachMaskEvents();
            this._initMaskState();
            this._renderDateParts()
        }
    },
    _renderDateParts() {
        if (!this._useMaskBehavior()) {
            return
        }
        const text = this.option("text") || this._getDisplayedText(this._maskValue);
        if (text) {
            this._dateParts = renderDateParts(text, this._regExpInfo);
            if (!this._input().is(":hidden")) {
                this._selectNextPart()
            }
        }
    },
    _detachMaskEvents() {
        eventsEngine.off(this._input(), ".dateBoxMask")
    },
    _attachMaskEvents() {
        eventsEngine.on(this._input(), addNamespace("dxclick", "dateBoxMask"), this._maskClickHandler.bind(this));
        eventsEngine.on(this._input(), addNamespace("paste", "dateBoxMask"), this._maskPasteHandler.bind(this));
        eventsEngine.on(this._input(), addNamespace("drop", "dateBoxMask"), (() => {
            this._renderSelectedPart()
        }));
        eventsEngine.on(this._input(), addNamespace("compositionend", "dateBoxMask"), this._maskCompositionEndHandler.bind(this));
        if (this._useBeforeInputEvent()) {
            eventsEngine.on(this._input(), addNamespace("beforeinput", "dateBoxMask"), this._maskBeforeInputHandler.bind(this))
        }
    },
    _renderSelectedPart() {
        this._renderDisplayText(this._getDisplayedText(this._maskValue));
        this._selectNextPart()
    },
    _selectLastPart() {
        if (this.option("text")) {
            this._activePartIndex = this._dateParts.length;
            this._selectNextPart(-1)
        }
    },
    _selectFirstPart() {
        if (this.option("text")) {
            this._activePartIndex = -1;
            this._selectNextPart(1)
        }
    },
    _onMouseWheel(e) {
        if (this._useMaskBehavior()) {
            this._partIncrease(e.delta > 0 ? 1 : -1, e)
        }
    },
    _selectNextPart() {
        let step = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
        if (!this.option("text") || this._disposed) {
            return
        }
        if (step) {
            this._initialMaskValue = new Date(this._maskValue)
        }
        let index = fitIntoRange(this._activePartIndex + step, 0, this._dateParts.length - 1);
        if (this._dateParts[index].isStub) {
            const isBoundaryIndex = 0 === index && step < 0 || index === this._dateParts.length - 1 && step > 0;
            if (!isBoundaryIndex) {
                this._selectNextPart(step >= 0 ? step + 1 : step - 1);
                return
            }
            index = this._activePartIndex
        }
        if (this._activePartIndex !== index) {
            this._clearSearchValue()
        }
        this._activePartIndex = index;
        this._caret(this._getActivePartProp("caret"))
    },
    _getRealLimitsPattern() {
        if ("d" === this._getActivePartProp("pattern")[0]) {
            return "dM"
        }
    },
    _getActivePartLimits(lockOtherParts) {
        const limitFunction = this._getActivePartProp("limits");
        return limitFunction(this._maskValue, lockOtherParts && this._getRealLimitsPattern())
    },
    _getActivePartValue(dateValue) {
        dateValue = dateValue || this._maskValue;
        const getter = this._getActivePartProp("getter");
        return isFunction(getter) ? getter(dateValue) : dateValue[getter]()
    },
    _addLeadingZeroes(value) {
        const zeroes = this._searchValue.match(/^0+/);
        const limits = this._getActivePartLimits();
        const maxLimitLength = String(limits.max).length;
        return ((zeroes && zeroes[0] || "") + String(value)).substr(-maxLimitLength)
    },
    _setActivePartValue(value, dateValue) {
        dateValue = dateValue || this._maskValue;
        const setter = this._getActivePartProp("setter");
        const limits = this._getActivePartLimits();
        value = inRange(value, limits.min, limits.max) ? value : value % 10;
        value = this._addLeadingZeroes(fitIntoRange(value, limits.min, limits.max));
        isFunction(setter) ? setter(dateValue, value) : dateValue[setter](value);
        this._renderDisplayText(this._getDisplayedText(dateValue));
        this._renderDateParts()
    },
    _getActivePartProp(property) {
        if (!this._dateParts || !this._dateParts[this._activePartIndex]) {
            return
        }
        return this._dateParts[this._activePartIndex][property]
    },
    _loadMaskValue() {
        let value = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.dateOption("value");
        this._maskValue = value && new Date(value);
        this._initialMaskValue = value && new Date(value)
    },
    _saveMaskValue() {
        const value = this._maskValue && new Date(this._maskValue);
        if (value && "date" === this.option("type")) {
            value.setHours(0, 0, 0, 0)
        }
        this._initialMaskValue = new Date(value);
        this.dateOption("value", value)
    },
    _revertChanges() {
        this._loadMaskValue();
        this._renderDisplayText(this._getDisplayedText(this._maskValue));
        this._renderDateParts()
    },
    _renderDisplayText(text) {
        this.callBase(text);
        if (this._useMaskBehavior()) {
            this.option("text", text)
        }
    },
    _partIncrease(step, lockOtherParts) {
        this._setNewDateIfEmpty();
        const {
            max: max,
            min: min
        } = this._getActivePartLimits(lockOtherParts);
        let newValue = step + this._getActivePartValue();
        if (newValue > max) {
            newValue = this._applyLimits(newValue, {
                limitBase: min,
                limitClosest: max,
                max: max
            })
        } else if (newValue < min) {
            newValue = this._applyLimits(newValue, {
                limitBase: max,
                limitClosest: min,
                max: max
            })
        }
        this._setActivePartValue(newValue)
    },
    _applyLimits(newValue, _ref2) {
        let {
            limitBase: limitBase,
            limitClosest: limitClosest,
            max: max
        } = _ref2;
        const delta = (newValue - limitClosest) % max;
        return delta ? limitBase + delta - 1 * sign(delta) : limitClosest
    },
    _maskClickHandler() {
        this._loadMaskValue(this._maskValue);
        if (this.option("text")) {
            this._activePartIndex = getDatePartIndexByPosition(this._dateParts, this._caret().start);
            if (!this._isAllSelected()) {
                if (isDefined(this._activePartIndex)) {
                    this._caret(this._getActivePartProp("caret"))
                } else {
                    this._selectLastPart()
                }
            }
        }
    },
    _maskCompositionEndHandler(e) {
        this._input().val(this._getDisplayedText(this._maskValue));
        this._selectNextPart();
        this._maskInputHandler = () => {
            this._renderSelectedPart()
        }
    },
    _maskPasteHandler(e) {
        const newText = this._replaceSelectedText(this.option("text"), this._caret(), clipboardText(e));
        const date = dateLocalization.parse(newText, this._getFormatPattern());
        if (date && this._isDateValid(date)) {
            this._maskValue = date;
            this._renderDisplayText(this._getDisplayedText(this._maskValue));
            this._renderDateParts();
            this._selectNextPart()
        }
        e.preventDefault()
    },
    _isDateValid: date => isDate(date) && !isNaN(date),
    _isValueDirty() {
        const value = this.dateOption("value");
        return (this._maskValue && this._maskValue.getTime()) !== (value && value.getTime())
    },
    _fireChangeEvent() {
        this._clearSearchValue();
        if (this._isValueDirty()) {
            eventsEngine.trigger(this._input(), "change")
        }
    },
    _enterHandler() {
        this._fireChangeEvent();
        this._selectNextPart(1)
    },
    _focusOutHandler(e) {
        const shouldFireChangeEvent = this._useMaskBehavior() && !e.isDefaultPrevented();
        if (shouldFireChangeEvent) {
            this._fireChangeEvent();
            this.callBase(e);
            this._selectFirstPart(e)
        } else {
            this.callBase(e)
        }
    },
    _valueChangeEventHandler(e) {
        const text = this.option("text");
        if (this._useMaskBehavior()) {
            this._saveValueChangeEvent(e);
            if (!text) {
                this._maskValue = null
            } else if (null === this._maskValue) {
                this._loadMaskValue(text)
            }
            this._saveMaskValue()
        } else {
            this.callBase(e)
        }
    },
    _optionChanged(args) {
        switch (args.name) {
            case "useMaskBehavior":
                this._renderMask();
                break;
            case "displayFormat":
            case "mode":
                this.callBase(args);
                this._renderMask();
                break;
            case "value":
                this._loadMaskValue();
                this.callBase(args);
                this._renderDateParts();
                break;
            case "emptyDateValue":
                break;
            default:
                this.callBase(args)
        }
    },
    _clearMaskState() {
        this._clearSearchValue();
        delete this._dateParts;
        delete this._activePartIndex;
        delete this._maskValue
    },
    clear() {
        this._clearMaskState();
        this._activePartIndex = 0;
        this.callBase()
    },
    _clean() {
        this.callBase();
        this._detachMaskEvents();
        this._clearMaskState()
    }
});
export default DateBoxMask;
