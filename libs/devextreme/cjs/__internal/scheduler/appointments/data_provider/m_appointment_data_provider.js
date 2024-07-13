/**
 * DevExtreme (cjs/__internal/scheduler/appointments/data_provider/m_appointment_data_provider.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppointmentDataProvider = void 0;
var _config = _interopRequireDefault(require("../../../../core/config"));
var _index = require("../../../scheduler/r1/filterting/index");
var _m_appointment_data_source = require("./m_appointment_data_source");
var _m_appointment_filter = require("./m_appointment_filter");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const FilterStrategies = {
    virtual: "virtual",
    standard: "standard"
};
class AppointmentDataProvider {
    constructor(options) {
        this.options = options;
        this.dataSource = this.options.dataSource;
        this.dataAccessors = this.options.dataAccessors;
        this.timeZoneCalculator = this.options.timeZoneCalculator;
        this.appointmentDataSource = new _m_appointment_data_source.AppointmentDataSource(this.dataSource);
        this.initFilterStrategy()
    }
    get keyName() {
        return this.appointmentDataSource.keyName
    }
    get isDataSourceInit() {
        return !!this.dataSource
    }
    get filterStrategyName() {
        return this.options.getIsVirtualScrolling() ? FilterStrategies.virtual : FilterStrategies.standard
    }
    getFilterStrategy() {
        if (!this.filterStrategy || this.filterStrategy.strategyName !== this.filterStrategyName) {
            this.initFilterStrategy()
        }
        return this.filterStrategy
    }
    initFilterStrategy() {
        const filterOptions = {
            resources: this.options.resources,
            dataAccessors: this.dataAccessors,
            startDayHour: this.options.startDayHour,
            endDayHour: this.options.endDayHour,
            viewOffset: this.options.viewOffset,
            showAllDayPanel: this.options.showAllDayPanel,
            timeZoneCalculator: this.options.timeZoneCalculator,
            loadedResources: this.options.getLoadedResources,
            supportAllDayRow: this.options.getSupportAllDayRow,
            viewType: this.options.getViewType,
            viewDirection: this.options.getViewDirection,
            dateRange: this.options.getDateRange,
            groupCount: this.options.getGroupCount,
            viewDataProvider: this.options.getViewDataProvider,
            allDayPanelMode: this.options.allDayPanelMode
        };
        this.filterStrategy = this.filterStrategyName === FilterStrategies.virtual ? new _m_appointment_filter.AppointmentFilterVirtualStrategy(filterOptions) : new _m_appointment_filter.AppointmentFilterBaseStrategy(filterOptions)
    }
    setDataSource(dataSource) {
        this.dataSource = dataSource;
        this.initFilterStrategy();
        this.appointmentDataSource.setDataSource(this.dataSource)
    }
    updateDataAccessors(dataAccessors) {
        this.dataAccessors = dataAccessors;
        this.initFilterStrategy()
    }
    filter(preparedItems) {
        return this.getFilterStrategy().filter(preparedItems)
    }
    filterByDate(min, max, remoteFiltering, dateSerializationFormat) {
        if (!this.dataSource || !remoteFiltering) {
            return
        }
        const dataSourceFilter = this.dataSource.filter();
        const filter = (0, _index.combineRemoteFilter)({
            dataSourceFilter: dataSourceFilter,
            dataAccessors: this.dataAccessors,
            min: min,
            max: max,
            dateSerializationFormat: dateSerializationFormat,
            forceIsoDateParsing: (0, _config.default)().forceIsoDateParsing
        });
        this.dataSource.filter(filter)
    }
    hasAllDayAppointments(filteredItems, preparedItems) {
        return this.getFilterStrategy().hasAllDayAppointments(filteredItems, preparedItems)
    }
    filterLoadedAppointments(filterOption, preparedItems) {
        return this.getFilterStrategy().filterLoadedAppointments(filterOption, preparedItems)
    }
    calculateAppointmentEndDate(isAllDay, startDate) {
        return this.getFilterStrategy().calculateAppointmentEndDate(isAllDay, startDate)
    }
    cleanState() {
        this.appointmentDataSource.cleanState()
    }
    getUpdatedAppointment() {
        return this.appointmentDataSource._updatedAppointment
    }
    getUpdatedAppointmentKeys() {
        return this.appointmentDataSource._updatedAppointmentKeys
    }
    add(rawAppointment) {
        return this.appointmentDataSource.add(rawAppointment)
    }
    update(target, rawAppointment) {
        return this.appointmentDataSource.update(target, rawAppointment)
    }
    remove(rawAppointment) {
        return this.appointmentDataSource.remove(rawAppointment)
    }
    destroy() {
        this.appointmentDataSource.destroy()
    }
}
exports.AppointmentDataProvider = AppointmentDataProvider;
