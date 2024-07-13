/**
 * DevExtreme (esm/ui/list/ui.list.edit.decorator_menu_helper.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
const EditDecoratorMenuHelperMixin = {
    _menuEnabled: function() {
        return !!this._menuItems().length
    },
    _menuItems: function() {
        return this._list.option("menuItems")
    },
    _deleteEnabled: function() {
        return this._list.option("allowItemDeleting")
    },
    _fireMenuAction: function($itemElement, action) {
        this._list._itemEventHandlerByHandler($itemElement, action, {}, {
            excludeValidators: ["disabled", "readOnly"]
        })
    }
};
export default EditDecoratorMenuHelperMixin;
