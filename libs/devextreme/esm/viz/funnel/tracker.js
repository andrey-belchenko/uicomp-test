/**
 * DevExtreme (esm/viz/funnel/tracker.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import Funnel from "./funnel";
import {
    Tracker
} from "../components/tracker";
const DATA_KEY_BASE = "__funnel_data_";
import {
    isDefined
} from "../../core/utils/type";
let dataKeyModifier = 0;
const proto = Funnel.prototype;
proto._eventsMap.onItemClick = {
    name: "itemClick"
};
proto._eventsMap.onLegendClick = {
    name: "legendClick"
};
const getDataKey = function() {
    return DATA_KEY_BASE + dataKeyModifier++
};
export const plugin = {
    name: "tracker",
    init: function() {
        const that = this;
        const dataKey = getDataKey();
        const getProxyData = function(e) {
            const rootOffset = that._renderer.getRootOffset();
            const x = Math.floor(e.pageX - rootOffset.left);
            const y = Math.floor(e.pageY - rootOffset.top);
            return that._hitTestTargets(x, y)
        };
        that._tracker = new Tracker({
            widget: that,
            root: that._renderer.root,
            getData: function(e, tooltipData) {
                const target = e.target;
                const data = target[dataKey];
                if (isDefined(data)) {
                    return data
                }
                const proxyData = getProxyData(e);
                if (tooltipData && proxyData && "inside-label" !== proxyData.type) {
                    return
                }
                return proxyData && proxyData.id
            },
            getNode: function(index) {
                return that._items[index]
            },
            click: function(e) {
                const proxyData = getProxyData(e.event);
                const dataType = proxyData && proxyData.type;
                const event = "legend" === dataType ? "legendClick" : "itemClick";
                that._eventTrigger(event, {
                    item: e.node,
                    event: e.event
                })
            }
        });
        this._dataKey = dataKey
    },
    dispose: function() {
        this._tracker.dispose()
    },
    extenders: {
        _change_TILING: function() {
            const dataKey = this._dataKey;
            this._items.forEach((function(item, index) {
                item.element.data(dataKey, index)
            }))
        }
    }
};
