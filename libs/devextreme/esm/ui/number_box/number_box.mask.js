/**
 * DevExtreme (esm/ui/number_box/number_box.mask.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import eventsEngine from "../../events/core/events_engine";
import {
    name as dxDblClickEvent
} from "../../events/double_click";
import {
    extend
} from "../../core/utils/extend";
import {
    isNumeric,
    isDefined,
    isFunction,
    isString
} from "../../core/utils/type";
import devices from "../../core/devices";
import {
    fitIntoRange,
    inRange
} from "../../core/utils/math";
import number from "../../localization/number";
import {
    getCaretWithOffset,
    isCaretInBoundaries,
    getCaretInBoundaries,
    getCaretBoundaries,
    getCaretAfterFormat,
    getCaretOffset
} from "./number_box.caret";
import {
    getFormat as getLDMLFormat
} from "../../localization/ldml/number";
import NumberBoxBase from "./number_box.base";
import {
    addNamespace,
    getChar,
    normalizeKeyName,
    isCommandKeyPressed
} from "../../events/utils/index";
import {
    ensureDefined,
    escapeRegExp
} from "../../core/utils/common";
import {
    getRealSeparatorIndex,
    getNthOccurrence,
    splitByIndex,
    adjustPercentValue
} from "./utils";
const NUMBER_FORMATTER_NAMESPACE = "dxNumberFormatter";
const MOVE_FORWARD = 1;
const MOVE_BACKWARD = -1;
const MINUS = "-";
const MINUS_KEY = "minus";
const INPUT_EVENT = "input";
const NUMPAD_DOT_KEY_CODE = 110;
const CARET_TIMEOUT_DURATION = 0;
const NumberBoxMask = NumberBoxBase.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            useMaskBehavior: true,
            format: null
        })
    },
    _isDeleteKey: function(key) {
        return "del" === key
    },
    _supportedKeys: function() {
        if (!this._useMaskBehavior()) {
            return this.callBase()
        }
        return extend(this.callBase(), {
            minus: this._revertSign.bind(this),
            del: this._removeHandler.bind(this),
            backspace: this._removeHandler.bind(this),
            leftArrow: this._arrowHandler.bind(this, -1),
            rightArrow: this._arrowHandler.bind(this, 1),
            home: this._moveCaretToBoundaryEventHandler.bind(this, 1),
            enter: this._updateFormattedValue.bind(this),
            end: this._moveCaretToBoundaryEventHandler.bind(this, -1)
        })
    },
    _getTextSeparatorIndex: function(text) {
        const decimalSeparator = number.getDecimalSeparator();
        const realSeparatorOccurrenceIndex = getRealSeparatorIndex(this.option("format")).occurrence;
        return getNthOccurrence(text, decimalSeparator, realSeparatorOccurrenceIndex)
    },
    _focusInHandler: function(e) {
        if (!this._preventNestedFocusEvent(e)) {
            this.clearCaretTimeout();
            this._caretTimeout = setTimeout(function() {
                this._caretTimeout = void 0;
                const caret = this._caret();
                if (caret.start === caret.end && this._useMaskBehavior()) {
                    const text = this._getInputVal();
                    const decimalSeparatorIndex = this._getTextSeparatorIndex(text);
                    if (decimalSeparatorIndex >= 0) {
                        this._caret({
                            start: decimalSeparatorIndex,
                            end: decimalSeparatorIndex
                        })
                    } else {
                        this._moveCaretToBoundaryEventHandler(-1, e)
                    }
                }
            }.bind(this), 0)
        }
        this.callBase(e)
    },
    _focusOutHandler: function(e) {
        const shouldHandleEvent = !this._preventNestedFocusEvent(e);
        if (shouldHandleEvent) {
            this._focusOutOccurs = true;
            if (this._useMaskBehavior()) {
                this._updateFormattedValue()
            }
        }
        this.callBase(e);
        if (shouldHandleEvent) {
            this._focusOutOccurs = false
        }
    },
    _hasValueBeenChanged(inputValue) {
        const format = this._getFormatPattern();
        const value = this.option("value");
        const formatted = this._format(value, format) || "";
        return formatted !== inputValue
    },
    _updateFormattedValue: function() {
        const inputValue = this._getInputVal();
        if (this._hasValueBeenChanged(inputValue)) {
            this._updateParsedValue();
            this._adjustParsedValue();
            this._setTextByParsedValue();
            if (this._parsedValue !== this.option("value")) {
                eventsEngine.trigger(this._input(), "change")
            }
        }
    },
    _arrowHandler: function(step, e) {
        if (!this._useMaskBehavior()) {
            return
        }
        const text = this._getInputVal();
        const format = this._getFormatPattern();
        let nextCaret = getCaretWithOffset(this._caret(), step);
        if (!isCaretInBoundaries(nextCaret, text, format)) {
            nextCaret = 1 === step ? nextCaret.end : nextCaret.start;
            e.preventDefault();
            this._caret(getCaretInBoundaries(nextCaret, text, format))
        }
    },
    _moveCaretToBoundary: function(direction) {
        const boundaries = getCaretBoundaries(this._getInputVal(), this._getFormatPattern());
        const newCaret = getCaretWithOffset(1 === direction ? boundaries.start : boundaries.end, 0);
        this._caret(newCaret)
    },
    _moveCaretToBoundaryEventHandler: function(direction, e) {
        if (!this._useMaskBehavior() || e && e.shiftKey) {
            return
        }
        this._moveCaretToBoundary(direction);
        e && e.preventDefault()
    },
    _shouldMoveCaret: function(text, caret) {
        const decimalSeparator = number.getDecimalSeparator();
        const isDecimalSeparatorNext = text.charAt(caret.end) === decimalSeparator;
        const moveToFloat = (this._lastKey === decimalSeparator || "." === this._lastKey || "," === this._lastKey) && isDecimalSeparatorNext;
        return moveToFloat
    },
    _getInputVal: function() {
        return number.convertDigits(this._input().val(), true)
    },
    _keyboardHandler: function(e) {
        this.clearCaretTimeout();
        this._lastKey = number.convertDigits(getChar(e), true);
        this._lastKeyName = normalizeKeyName(e);
        if (!this._shouldHandleKey(e.originalEvent)) {
            return this.callBase(e)
        }
        const normalizedText = this._getInputVal();
        const caret = this._caret();
        let enteredChar;
        if ("minus" === this._lastKeyName) {
            enteredChar = ""
        } else {
            enteredChar = 110 === e.which ? number.getDecimalSeparator() : this._lastKey
        }
        const newValue = this._tryParse(normalizedText, caret, enteredChar);
        if (this._shouldMoveCaret(normalizedText, caret)) {
            this._moveCaret(1);
            e.originalEvent.preventDefault()
        }
        if (void 0 === newValue) {
            if ("minus" !== this._lastKeyName) {
                e.originalEvent.preventDefault()
            }
        } else {
            this._parsedValue = newValue
        }
        return this.callBase(e)
    },
    _keyPressHandler: function(e) {
        if (!this._useMaskBehavior()) {
            this.callBase(e)
        }
    },
    _removeHandler: function(e) {
        const caret = this._caret();
        const text = this._getInputVal();
        let start = caret.start;
        let end = caret.end;
        this._lastKey = getChar(e);
        this._lastKeyName = normalizeKeyName(e);
        const isDeleteKey = this._isDeleteKey(this._lastKeyName);
        const isBackspaceKey = !isDeleteKey;
        if (start === end) {
            const caretPosition = start;
            const canDelete = isBackspaceKey && caretPosition > 0 || isDeleteKey && caretPosition < text.length;
            if (canDelete) {
                isDeleteKey && end++;
                isBackspaceKey && start--
            } else {
                e.preventDefault();
                return
            }
        }
        const char = text.slice(start, end);
        if (this._isStub(char)) {
            this._moveCaret(isDeleteKey ? 1 : -1);
            if (this._parsedValue < 0 || 1 / this._parsedValue === -1 / 0) {
                this._revertSign(e);
                this._setTextByParsedValue();
                const shouldTriggerInputEvent = this.option("valueChangeEvent").split(" ").includes("input");
                if (shouldTriggerInputEvent) {
                    eventsEngine.trigger(this._input(), "input")
                }
            }
            e.preventDefault();
            return
        }
        const decimalSeparator = number.getDecimalSeparator();
        if (char === decimalSeparator) {
            const decimalSeparatorIndex = text.indexOf(decimalSeparator);
            if (this._isNonStubAfter(decimalSeparatorIndex + 1)) {
                this._moveCaret(isDeleteKey ? 1 : -1);
                e.preventDefault()
            }
            return
        }
        if (end - start < text.length) {
            const editedText = this._replaceSelectedText(text, {
                start: start,
                end: end
            }, "");
            const noDigits = editedText.search(/[0-9]/) < 0;
            if (noDigits && this._isValueInRange(0)) {
                this._parsedValue = this._parsedValue < 0 || 1 / this._parsedValue === -1 / 0 ? -0 : 0;
                return
            }
        }
        const valueAfterRemoving = this._tryParse(text, {
            start: start,
            end: end
        }, "");
        if (void 0 === valueAfterRemoving) {
            e.preventDefault()
        } else {
            this._parsedValue = valueAfterRemoving
        }
    },
    _isPercentFormat: function() {
        const format = this._getFormatPattern();
        const noEscapedFormat = format.replace(/'[^']+'/g, "");
        return -1 !== noEscapedFormat.indexOf("%")
    },
    _parse: function(text, format) {
        const formatOption = this.option("format");
        const isCustomParser = isFunction(formatOption.parser);
        const parser = isCustomParser ? formatOption.parser : number.parse;
        let integerPartStartIndex = 0;
        if (!isCustomParser) {
            const formatPointIndex = getRealSeparatorIndex(format).index;
            const textPointIndex = this._getTextSeparatorIndex(text);
            const formatIntegerPartLength = -1 !== formatPointIndex ? formatPointIndex : format.length;
            const textIntegerPartLength = -1 !== textPointIndex ? textPointIndex : text.length;
            if (textIntegerPartLength > formatIntegerPartLength && -1 === format.indexOf("#")) {
                integerPartStartIndex = textIntegerPartLength - formatIntegerPartLength
            }
        }
        text = text.substr(integerPartStartIndex);
        return parser(text, format)
    },
    _format: function(value, format) {
        const formatOption = this.option("format");
        const customFormatter = (null === formatOption || void 0 === formatOption ? void 0 : formatOption.formatter) || formatOption;
        const formatter = isFunction(customFormatter) ? customFormatter : number.format;
        const formattedValue = null === value ? "" : formatter(value, format);
        return formattedValue
    },
    _getFormatPattern: function() {
        if (!this._currentFormat) {
            this._updateFormat()
        }
        return this._currentFormat
    },
    _updateFormat: function() {
        const format = this.option("format");
        const isCustomParser = isFunction(null === format || void 0 === format ? void 0 : format.parser);
        const isLDMLPattern = isString(format) && (format.indexOf("0") >= 0 || format.indexOf("#") >= 0);
        const isExponentialFormat = "exponential" === format || "exponential" === (null === format || void 0 === format ? void 0 : format.type);
        const shouldUseFormatAsIs = isCustomParser || isLDMLPattern || isExponentialFormat;
        this._currentFormat = shouldUseFormatAsIs ? format : getLDMLFormat((value => {
            const text = this._format(value, format);
            return number.convertDigits(text, true)
        }))
    },
    _getFormatForSign: function(text) {
        const format = this._getFormatPattern();
        if (isString(format)) {
            const signParts = format.split(";");
            const sign = number.getSign(text, format);
            signParts[1] = signParts[1] || "-" + signParts[0];
            return sign < 0 ? signParts[1] : signParts[0]
        } else {
            const sign = number.getSign(text);
            return sign < 0 ? "-" : ""
        }
    },
    _removeStubs: function(text, excludeComma) {
        const format = this._getFormatForSign(text);
        const thousandsSeparator = number.getThousandsSeparator();
        const stubs = this._getStubs(format);
        let result = text;
        if (stubs.length) {
            const prefixStubs = stubs[0];
            const postfixRegex = new RegExp("(" + escapeRegExp(stubs[1] || "") + ")$", "g");
            const decoratorsRegex = new RegExp("[-" + escapeRegExp(excludeComma ? "" : thousandsSeparator) + "]", "g");
            result = result.replace(prefixStubs, "").replace(postfixRegex, "").replace(decoratorsRegex, "")
        }
        return result
    },
    _getStubs: function(format) {
        const regExpResult = /[^']([#0.,]+)/g.exec(format);
        const pattern = regExpResult && regExpResult[0].trim();
        return format.split(pattern).map((function(stub) {
            return stub.replace(/'/g, "")
        }))
    },
    _truncateToPrecision: function(value, maxPrecision) {
        if (isDefined(value)) {
            const strValue = value.toString();
            const decimalSeparatorIndex = strValue.indexOf(".");
            if (strValue && decimalSeparatorIndex > -1) {
                const parsedValue = parseFloat(strValue.substr(0, decimalSeparatorIndex + maxPrecision + 1));
                return isNaN(parsedValue) ? value : parsedValue
            }
        }
        return value
    },
    _tryParse: function(text, selection, char) {
        const isTextSelected = selection.start !== selection.end;
        const isWholeTextSelected = isTextSelected && 0 === selection.start && selection.end === text.length;
        const decimalSeparator = number.getDecimalSeparator();
        if (isWholeTextSelected && char === decimalSeparator) {
            return 0
        }
        const editedText = this._replaceSelectedText(text, selection, char);
        const format = this._getFormatPattern();
        let parsedValue = this._getParsedValue(editedText, format);
        const maxPrecision = !format.parser && this._getPrecisionLimits(editedText).max;
        const isValueChanged = parsedValue !== this._parsedValue;
        const isDecimalPointRestricted = char === decimalSeparator && 0 === maxPrecision;
        const isUselessCharRestricted = !isTextSelected && !isValueChanged && "-" !== char && this._isStub(char);
        if (isDecimalPointRestricted || isUselessCharRestricted) {
            return
        }
        if ("" === this._removeStubs(editedText)) {
            parsedValue = Math.abs(0 * this._parsedValue)
        }
        if (isNaN(parsedValue)) {
            return
        }
        const value = null === parsedValue ? this._parsedValue : parsedValue;
        parsedValue = maxPrecision ? this._truncateToPrecision(value, maxPrecision) : parsedValue;
        return !format.parser && this._isPercentFormat() ? adjustPercentValue(parsedValue, maxPrecision) : parsedValue
    },
    _getParsedValue: function(text, format) {
        const sign = number.getSign(text, (null === format || void 0 === format ? void 0 : format.formatter) || format);
        const textWithoutStubs = this._removeStubs(text, true);
        const parsedValue = this._parse(textWithoutStubs, format);
        const parsedValueSign = parsedValue < 0 ? -1 : 1;
        const parsedValueWithSign = isNumeric(parsedValue) && sign !== parsedValueSign ? sign * parsedValue : parsedValue;
        return parsedValueWithSign
    },
    _isValueIncomplete: function(text) {
        if (!this._useMaskBehavior()) {
            return this.callBase(text)
        }
        const caret = this._caret();
        const point = number.getDecimalSeparator();
        const pointIndex = this._getTextSeparatorIndex(text);
        const isCaretOnFloat = pointIndex >= 0 && pointIndex < caret.start;
        const textParts = this._removeStubs(text, true).split(point);
        if (!isCaretOnFloat || 2 !== textParts.length) {
            return false
        }
        const floatLength = textParts[1].length;
        const format = this._getFormatPattern();
        const isCustomParser = !!format.parser;
        const precision = !isCustomParser && this._getPrecisionLimits(this._getFormatPattern(), text);
        const isPrecisionInRange = isCustomParser ? true : inRange(floatLength, precision.min, precision.max);
        const endsWithZero = "0" === textParts[1].charAt(floatLength - 1);
        return isPrecisionInRange && (endsWithZero || !floatLength)
    },
    _isValueInRange: function(value) {
        const min = ensureDefined(this.option("min"), -1 / 0);
        const max = ensureDefined(this.option("max"), 1 / 0);
        return inRange(value, min, max)
    },
    _setInputText: function(text) {
        const normalizedText = number.convertDigits(text, true);
        const newCaret = getCaretAfterFormat(this._getInputVal(), normalizedText, this._caret(), this._getFormatPattern());
        this._input().val(text);
        this._toggleEmptinessEventHandler();
        this._formattedValue = text;
        if (!this._focusOutOccurs) {
            this._caret(newCaret)
        }
    },
    _useMaskBehavior: function() {
        return !!this.option("format") && this.option("useMaskBehavior")
    },
    _renderInputType: function() {
        const isNumberType = "number" === this.option("mode");
        const isDesktop = "desktop" === devices.real().deviceType;
        if (this._useMaskBehavior() && isNumberType) {
            this._setInputType(isDesktop || this._isSupportInputMode() ? "text" : "tel")
        } else {
            this.callBase()
        }
    },
    _isChar: function(str) {
        return isString(str) && 1 === str.length
    },
    _moveCaret: function(offset) {
        if (!offset) {
            return
        }
        const newCaret = getCaretWithOffset(this._caret(), offset);
        const adjustedCaret = getCaretInBoundaries(newCaret, this._getInputVal(), this._getFormatPattern());
        this._caret(adjustedCaret)
    },
    _shouldHandleKey: function(e) {
        const keyName = normalizeKeyName(e);
        const isSpecialChar = isCommandKeyPressed(e) || e.altKey || e.shiftKey || !this._isChar(keyName);
        const isMinusKey = "minus" === keyName;
        const useMaskBehavior = this._useMaskBehavior();
        return useMaskBehavior && !isSpecialChar && !isMinusKey
    },
    _renderInput: function() {
        this.callBase();
        this._renderFormatter()
    },
    _renderFormatter: function() {
        this._clearCache();
        this._detachFormatterEvents();
        if (this._useMaskBehavior()) {
            this._attachFormatterEvents()
        }
    },
    _detachFormatterEvents: function() {
        eventsEngine.off(this._input(), ".dxNumberFormatter")
    },
    _isInputFromPaste: function(e) {
        const inputType = e.originalEvent && e.originalEvent.inputType;
        if (isDefined(inputType)) {
            return "insertFromPaste" === inputType
        } else {
            return this._isValuePasted
        }
    },
    _attachFormatterEvents: function() {
        const $input = this._input();
        eventsEngine.on($input, addNamespace("input", "dxNumberFormatter"), function(e) {
            this._formatValue(e);
            this._isValuePasted = false
        }.bind(this));
        eventsEngine.on($input, addNamespace("dxclick", "dxNumberFormatter"), function() {
            if (!this._caretTimeout) {
                this._caretTimeout = setTimeout(function() {
                    this._caretTimeout = void 0;
                    this._caret(getCaretInBoundaries(this._caret(), this._getInputVal(), this._getFormatPattern()))
                }.bind(this), 0)
            }
        }.bind(this));
        eventsEngine.on($input, dxDblClickEvent, function() {
            this.clearCaretTimeout()
        }.bind(this))
    },
    clearCaretTimeout: function() {
        clearTimeout(this._caretTimeout);
        this._caretTimeout = void 0
    },
    _forceRefreshInputValue: function() {
        if (!this._useMaskBehavior()) {
            return this.callBase()
        }
    },
    _isNonStubAfter: function(index) {
        const text = this._getInputVal().slice(index);
        return text && !this._isStub(text, true)
    },
    _isStub: function(str, isString) {
        const escapedDecimalSeparator = escapeRegExp(number.getDecimalSeparator());
        const regExpString = "^[^0-9" + escapedDecimalSeparator + "]+$";
        const stubRegExp = new RegExp(regExpString, "g");
        return stubRegExp.test(str) && (isString || this._isChar(str))
    },
    _parseValue: function(text) {
        if (!this._useMaskBehavior()) {
            return this.callBase(text)
        }
        return this._parsedValue
    },
    _getPrecisionLimits: function(text) {
        const currentFormat = this._getFormatForSign(text);
        const realSeparatorIndex = getRealSeparatorIndex(currentFormat).index;
        const floatPart = (splitByIndex(currentFormat, realSeparatorIndex)[1] || "").replace(/[^#0]/g, "");
        const minPrecision = floatPart.replace(/^(0*)#*/, "$1").length;
        const maxPrecision = floatPart.length;
        return {
            min: minPrecision,
            max: maxPrecision
        }
    },
    _revertSign: function(e) {
        if (!this._useMaskBehavior()) {
            return
        }
        const caret = this._caret();
        if (caret.start !== caret.end) {
            if ("minus" === normalizeKeyName(e)) {
                this._applyRevertedSign(e, caret, true);
                return
            } else {
                this._caret(getCaretInBoundaries(0, this._getInputVal(), this._getFormatPattern()))
            }
        }
        this._applyRevertedSign(e, caret)
    },
    _applyRevertedSign: function(e, caret, preserveSelectedText) {
        const newValue = -1 * ensureDefined(this._parsedValue, null);
        if (this._isValueInRange(newValue) || 0 === newValue) {
            this._parsedValue = newValue;
            if (preserveSelectedText) {
                const format = this._getFormatPattern();
                const previousText = this._getInputVal();
                this._setTextByParsedValue();
                e.preventDefault();
                const currentText = this._getInputVal();
                const offset = getCaretOffset(previousText, currentText, format);
                caret = getCaretWithOffset(caret, offset);
                const caretInBoundaries = getCaretInBoundaries(caret, currentText, format);
                this._caret(caretInBoundaries)
            }
        }
    },
    _removeMinusFromText: function(text, caret) {
        const isMinusPressed = "minus" === this._lastKeyName && "-" === text.charAt(caret.start - 1);
        return isMinusPressed ? this._replaceSelectedText(text, {
            start: caret.start - 1,
            end: caret.start
        }, "") : text
    },
    _setTextByParsedValue: function() {
        const format = this._getFormatPattern();
        const parsed = this._parseValue();
        const formatted = this._format(parsed, format) || "";
        this._setInputText(formatted)
    },
    _formatValue: function(e) {
        let normalizedText = this._getInputVal();
        const caret = this._caret();
        const textWithoutMinus = this._removeMinusFromText(normalizedText, caret);
        const wasMinusRemoved = textWithoutMinus !== normalizedText;
        normalizedText = textWithoutMinus;
        if (!this._isInputFromPaste(e) && this._isValueIncomplete(textWithoutMinus)) {
            this._formattedValue = normalizedText;
            if (wasMinusRemoved) {
                this._setTextByParsedValue()
            }
            return
        }
        const textWasChanged = number.convertDigits(this._formattedValue, true) !== normalizedText;
        if (textWasChanged) {
            const value = this._tryParse(normalizedText, caret, "");
            if (isDefined(value)) {
                this._parsedValue = value
            }
        }
        this._setTextByParsedValue()
    },
    _renderDisplayText: function() {
        if (this._useMaskBehavior()) {
            this._toggleEmptinessEventHandler()
        } else {
            this.callBase.apply(this, arguments)
        }
    },
    _renderValue: function() {
        if (this._useMaskBehavior()) {
            this._parsedValue = this.option("value");
            this._setTextByParsedValue()
        }
        return this.callBase()
    },
    _updateParsedValue: function() {
        const inputValue = this._getInputVal();
        this._parsedValue = this._tryParse(inputValue, this._caret())
    },
    _adjustParsedValue: function() {
        if (!this._useMaskBehavior()) {
            return
        }
        const clearedText = this._removeStubs(this._getInputVal());
        const parsedValue = clearedText ? this._parseValue() : null;
        if (!isNumeric(parsedValue)) {
            this._parsedValue = parsedValue;
            return
        }
        this._parsedValue = fitIntoRange(parsedValue, this.option("min"), this.option("max"))
    },
    _valueChangeEventHandler: function(e) {
        if (!this._useMaskBehavior()) {
            return this.callBase(e)
        }
        const caret = this._caret();
        this._saveValueChangeEvent(e);
        this._lastKey = null;
        this._lastKeyName = null;
        this._updateParsedValue();
        this._adjustParsedValue();
        this.option("value", this._parsedValue);
        if (caret) {
            this._caret(caret)
        }
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "format":
            case "useMaskBehavior":
                this._renderInputType();
                this._updateFormat();
                this._renderFormatter();
                this._renderValue();
                this._refreshValueChangeEvent();
                this._refreshEvents();
                break;
            case "min":
            case "max":
                this._adjustParsedValue();
                this.callBase(args);
                break;
            default:
                this.callBase(args)
        }
    },
    _clearCache: function() {
        delete this._formattedValue;
        delete this._lastKey;
        delete this._lastKeyName;
        delete this._parsedValue;
        delete this._focusOutOccurs;
        clearTimeout(this._caretTimeout);
        delete this._caretTimeout
    },
    _clean: function() {
        this._clearCache();
        this.callBase()
    }
});
export default NumberBoxMask;
