/**
 * DevExtreme (esm/ui/list/ui.list.edit.search.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import ListEdit from "./ui.list.edit";
import searchBoxMixin from "../widget/ui.search_box_mixin";
const ListSearch = ListEdit.inherit(searchBoxMixin).inherit({
    _addWidgetPrefix: function(className) {
        return "dx-list-" + className
    },
    _getCombinedFilter: function() {
        const dataController = this._dataController;
        const storeLoadOptions = {
            filter: dataController.filter()
        };
        dataController.addSearchFilter(storeLoadOptions);
        const filter = storeLoadOptions.filter;
        return filter
    },
    _initDataSource: function() {
        const value = this.option("searchValue");
        const expr = this.option("searchExpr");
        const mode = this.option("searchMode");
        this.callBase();
        const dataController = this._dataController;
        value && value.length && dataController.searchValue(value);
        mode.length && dataController.searchOperation(searchBoxMixin.getOperationBySearchMode(mode));
        expr && dataController.searchExpr(expr)
    }
});
export default ListSearch;
