/**
 * DevExtreme (esm/ui/validation_group.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../core/renderer";
import registerComponent from "../core/component_registrator";
import DOMComponent from "../core/dom_component";
import ValidationSummary from "./validation_summary";
import ValidationEngine from "./validation_engine";
import Validator from "./validator";
const VALIDATION_ENGINE_CLASS = "dx-validationgroup";
const VALIDATOR_CLASS = "dx-validator";
const VALIDATION_SUMMARY_CLASS = "dx-validationsummary";
class ValidationGroup extends DOMComponent {
    _getDefaultOptions() {
        return super._getDefaultOptions()
    }
    _init() {
        super._init();
        ValidationEngine.addGroup(this)
    }
    _initMarkup() {
        const $element = this.$element();
        $element.addClass("dx-validationgroup");
        $element.find(".dx-validator").each((function(_, validatorContainer) {
            Validator.getInstance($(validatorContainer))._initGroupRegistration()
        }));
        $element.find(".dx-validationsummary").each((function(_, summaryContainer) {
            ValidationSummary.getInstance($(summaryContainer)).refreshValidationGroup()
        }));
        super._initMarkup()
    }
    validate() {
        return ValidationEngine.validateGroup(this)
    }
    reset() {
        return ValidationEngine.resetGroup(this)
    }
    _dispose() {
        ValidationEngine.removeGroup(this);
        this.$element().removeClass("dx-validationgroup");
        super._dispose()
    }
    _useTemplates() {
        return false
    }
}
registerComponent("dxValidationGroup", ValidationGroup);
export default ValidationGroup;
