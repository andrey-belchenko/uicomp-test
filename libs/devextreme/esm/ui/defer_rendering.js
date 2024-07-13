/**
 * DevExtreme (esm/ui/defer_rendering.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    TransitionExecutor
} from "../animation/transition_executor/transition_executor";
import registerComponent from "../core/component_registrator";
import domAdapter from "../core/dom_adapter";
import $ from "../core/renderer";
import {
    noop,
    executeAsync
} from "../core/utils/common";
import {
    Deferred,
    fromPromise
} from "../core/utils/deferred";
import {
    extend
} from "../core/utils/extend";
import {
    each
} from "../core/utils/iterator";
import {
    isPromise
} from "../core/utils/type";
import {
    getWindow,
    hasWindow
} from "../core/utils/window";
import eventsEngine from "../events/core/events_engine";
import {
    triggerShownEvent
} from "../events/visibility_change";
import LoadIndicator from "./load_indicator";
import Widget from "./widget/ui.widget";
import {
    getBoundingRect
} from "../core/utils/position";
const window = getWindow();
const WIDGET_CLASS = "dx-widget";
const DEFER_RENDERING_CLASS = "dx-deferrendering";
const PENDING_RENDERING_CLASS = "dx-pending-rendering";
const PENDING_RENDERING_MANUAL_CLASS = "dx-pending-rendering-manual";
const PENDING_RENDERING_ACTIVE_CLASS = "dx-pending-rendering-active";
const VISIBLE_WHILE_PENDING_RENDERING_CLASS = "dx-visible-while-pending-rendering";
const INVISIBLE_WHILE_PENDING_RENDERING_CLASS = "dx-invisible-while-pending-rendering";
const LOADINDICATOR_CONTAINER_CLASS = "dx-loadindicator-container";
const DEFER_RENDERING_LOADINDICATOR_CONTAINER_CLASS = "dx-deferrendering-loadindicator-container";
const DEFER_DEFER_RENDERING_LOAD_INDICATOR = "dx-deferrendering-load-indicator";
const ANONYMOUS_TEMPLATE_NAME = "content";
const ACTIONS = ["onRendered", "onShown"];
const DeferRendering = Widget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            showLoadIndicator: false,
            renderWhen: void 0,
            animation: void 0,
            staggerItemSelector: void 0,
            onRendered: null,
            onShown: null
        })
    },
    _getAnonymousTemplateName: function() {
        return "content"
    },
    _init: function() {
        this.transitionExecutor = new TransitionExecutor;
        this._initElement();
        this._initRender();
        this._$initialContent = this.$element().clone().contents();
        this._initActions();
        this.callBase()
    },
    _initElement: function() {
        this.$element().addClass("dx-deferrendering")
    },
    _initRender: function() {
        const that = this;
        const $element = this.$element();
        const renderWhen = this.option("renderWhen");
        const doRender = () => that._renderDeferredContent();
        if (isPromise(renderWhen)) {
            fromPromise(renderWhen).done(doRender)
        } else {
            $element.data("dx-render-delegate", doRender);
            if (void 0 === renderWhen) {
                $element.addClass("dx-pending-rendering-manual")
            }
        }
    },
    _initActions: function() {
        this._actions = {};
        each(ACTIONS, ((_, action) => {
            this._actions[action] = this._createActionByOption(action) || noop
        }))
    },
    _initMarkup: function() {
        this.callBase();
        if (!this._initContent) {
            this._initContent = this._renderContent;
            this._renderContent = () => {}
        }
        this._initContent()
    },
    _renderContentImpl: function() {
        this.$element().removeClass("dx-widget");
        this.$element().append(this._$initialContent);
        this._setLoadingState()
    },
    _renderDeferredContent: function() {
        const that = this;
        const $element = this.$element();
        const result = new Deferred;
        $element.removeClass("dx-pending-rendering-manual");
        $element.addClass("dx-pending-rendering-active");
        this._abortRenderTask();
        this._renderTask = executeAsync((() => {
            that._renderImpl().done((() => {
                const shownArgs = {
                    element: $element
                };
                that._actions.onShown([shownArgs]);
                result.resolve(shownArgs)
            })).fail((function() {
                result.rejectWith(result, arguments)
            }))
        }));
        return result.promise()
    },
    _isElementInViewport: function(element) {
        const rect = getBoundingRect(element);
        return rect.bottom >= 0 && rect.right >= 0 && rect.top <= (window.innerHeight || domAdapter.getDocumentElement().clientHeight) && rect.left <= (window.innerWidth || domAdapter.getDocumentElement().clientWidth)
    },
    _animate: function() {
        const that = this;
        const $element = this.$element();
        const animation = hasWindow() && this.option("animation");
        const staggerItemSelector = this.option("staggerItemSelector");
        let animatePromise;
        that.transitionExecutor.stop();
        if (animation) {
            if (staggerItemSelector) {
                $element.find(staggerItemSelector).each((function() {
                    if (that._isElementInViewport(this)) {
                        that.transitionExecutor.enter($(this), animation)
                    }
                }))
            } else {
                that.transitionExecutor.enter($element, animation)
            }
            animatePromise = that.transitionExecutor.start()
        } else {
            animatePromise = (new Deferred).resolve().promise()
        }
        return animatePromise
    },
    _renderImpl: function() {
        const $element = this.$element();
        const renderedArgs = {
            element: $element
        };
        const contentTemplate = this._getTemplate(this._templateManager.anonymousTemplateName);
        if (contentTemplate) {
            contentTemplate.render({
                container: $element.empty(),
                noModel: true
            })
        }
        this._setRenderedState($element);
        eventsEngine.trigger($element, "dxcontentrendered");
        this._actions.onRendered([renderedArgs]);
        this._isRendered = true;
        return this._animate()
    },
    _setLoadingState: function() {
        const $element = this.$element();
        const hasCustomLoadIndicator = !!$element.find(".dx-visible-while-pending-rendering").length;
        $element.addClass("dx-pending-rendering");
        if (!hasCustomLoadIndicator) {
            $element.children().addClass("dx-invisible-while-pending-rendering")
        }
        if (this.option("showLoadIndicator")) {
            this._showLoadIndicator($element)
        }
    },
    _showLoadIndicator: function($container) {
        this._$loadIndicator = new LoadIndicator($("<div>"), {
            visible: true
        }).$element().addClass("dx-deferrendering-load-indicator");
        $("<div>").addClass("dx-loadindicator-container").addClass("dx-deferrendering-loadindicator-container").append(this._$loadIndicator).appendTo($container)
    },
    _setRenderedState: function() {
        const $element = this.$element();
        if (this._$loadIndicator) {
            this._$loadIndicator.remove()
        }
        $element.removeClass("dx-pending-rendering");
        $element.removeClass("dx-pending-rendering-active");
        triggerShownEvent($element.children())
    },
    _optionChanged: function(args) {
        const value = args.value;
        const previousValue = args.previousValue;
        switch (args.name) {
            case "renderWhen":
                if (false === previousValue && true === value) {
                    this._renderOrAnimate()
                } else if (true === previousValue && false === value) {
                    this.transitionExecutor.stop();
                    this._setLoadingState()
                }
                break;
            case "showLoadIndicator":
            case "onRendered":
            case "onShown":
                break;
            default:
                this.callBase(args)
        }
    },
    _renderOrAnimate: function() {
        let result;
        if (this._isRendered) {
            this._setRenderedState();
            result = this._animate()
        } else {
            result = this._renderDeferredContent()
        }
        return result
    },
    renderContent: function() {
        return this._renderOrAnimate()
    },
    _abortRenderTask: function() {
        if (this._renderTask) {
            this._renderTask.abort();
            this._renderTask = void 0
        }
    },
    _dispose: function() {
        this.transitionExecutor.stop(true);
        this._abortRenderTask();
        this._actions = void 0;
        this._$initialContent = void 0;
        this.callBase()
    }
});
registerComponent("dxDeferRendering", DeferRendering);
export default DeferRendering;
