/**
 * DevExtreme (cjs/ui/validation_group.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../core/renderer"));
var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));
var _dom_component = _interopRequireDefault(require("../core/dom_component"));
var _validation_summary = _interopRequireDefault(require("./validation_summary"));
var _validation_engine = _interopRequireDefault(require("./validation_engine"));
var _validator = _interopRequireDefault(require("./validator"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const VALIDATION_ENGINE_CLASS = "dx-validationgroup";
const VALIDATOR_CLASS = "dx-validator";
const VALIDATION_SUMMARY_CLASS = "dx-validationsummary";
class ValidationGroup extends _dom_component.default {
    _getDefaultOptions() {
        return super._getDefaultOptions()
    }
    _init() {
        super._init();
        _validation_engine.default.addGroup(this)
    }
    _initMarkup() {
        const $element = this.$element();
        $element.addClass("dx-validationgroup");
        $element.find(".dx-validator").each((function(_, validatorContainer) {
            _validator.default.getInstance((0, _renderer.default)(validatorContainer))._initGroupRegistration()
        }));
        $element.find(".dx-validationsummary").each((function(_, summaryContainer) {
            _validation_summary.default.getInstance((0, _renderer.default)(summaryContainer)).refreshValidationGroup()
        }));
        super._initMarkup()
    }
    validate() {
        return _validation_engine.default.validateGroup(this)
    }
    reset() {
        return _validation_engine.default.resetGroup(this)
    }
    _dispose() {
        _validation_engine.default.removeGroup(this);
        this.$element().removeClass("dx-validationgroup");
        super._dispose()
    }
    _useTemplates() {
        return false
    }
}(0, _component_registrator.default)("dxValidationGroup", ValidationGroup);
var _default = exports.default = ValidationGroup;
module.exports = exports.default;
module.exports.default = exports.default;
