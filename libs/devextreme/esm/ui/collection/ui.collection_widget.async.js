/**
 * DevExtreme (esm/ui/collection/ui.collection_widget.async.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import CollectionWidgetEdit from "./ui.collection_widget.edit";
import {
    Deferred,
    when
} from "../../core/utils/deferred";
import {
    noop
} from "../../core/utils/common";
const AsyncCollectionWidget = CollectionWidgetEdit.inherit({
    _initMarkup() {
        this._deferredItems = [];
        this.callBase()
    },
    _renderItemContent(args) {
        const renderContentDeferred = new Deferred;
        const itemDeferred = new Deferred;
        this._deferredItems[args.index] = itemDeferred;
        const $itemContent = this.callBase.call(this, args);
        itemDeferred.done((() => {
            renderContentDeferred.resolve($itemContent)
        }));
        return renderContentDeferred.promise()
    },
    _onItemTemplateRendered: function(itemTemplate, renderArgs) {
        return () => {
            this._deferredItems[renderArgs.index].resolve()
        }
    },
    _postProcessRenderItems: noop,
    _renderItemsAsync() {
        const d = new Deferred;
        when.apply(this, this._deferredItems).done((() => {
            this._postProcessRenderItems();
            d.resolve()
        }));
        return d.promise()
    },
    _clean() {
        this.callBase();
        this._deferredItems = []
    }
});
export default AsyncCollectionWidget;
