/**
 * DevExtreme (esm/ui/list/ui.list.edit.decorator.static.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import Button from "../button";
import {
    register as registerDecorator
} from "./ui.list.edit.decorator_registry";
import EditDecorator from "./ui.list.edit.decorator";
const STATIC_DELETE_BUTTON_CONTAINER_CLASS = "dx-list-static-delete-button-container";
const STATIC_DELETE_BUTTON_CLASS = "dx-list-static-delete-button";
registerDecorator("delete", "static", EditDecorator.inherit({
    afterBag: function(config) {
        const $itemElement = config.$itemElement;
        const $container = config.$container;
        const $button = $("<div>").addClass(STATIC_DELETE_BUTTON_CLASS);
        this._list._createComponent($button, Button, {
            icon: "remove",
            onClick: function(args) {
                args.event.stopPropagation();
                this._deleteItem($itemElement)
            }.bind(this),
            integrationOptions: {}
        });
        $container.addClass(STATIC_DELETE_BUTTON_CONTAINER_CLASS).append($button);
        this._updateButtonAttributes($button)
    },
    _deleteItem: function($itemElement) {
        if ($itemElement.is(".dx-state-disabled, .dx-state-disabled *")) {
            return
        }
        this._list.deleteItem($itemElement)
    }
}));
