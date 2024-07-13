/**
 * DevExtreme (esm/__internal/scheduler/r1/utils/base.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import {
    equalByValue
} from "../../../../core/utils/common";
import dateUtils from "../../../../core/utils/date";
import {
    isDefined
} from "../../../../core/utils/type";
import dateLocalization from "../../../../localization/date";
import {
    dateUtilsTs
} from "../../../core/utils/date";
import {
    VERTICAL_GROUP_COUNT_CLASSES
} from "../../m_classes";
import {
    VIEWS
} from "../../m_constants";
import timeZoneUtils from "../../m_utils_time_zone";
import {
    HORIZONTAL_GROUP_ORIENTATION,
    TIMELINE_VIEWS,
    VERTICAL_GROUP_ORIENTATION
} from "../const";
const toMs = dateUtils.dateToMilliseconds;
const DAY_HOURS = 24;
const HOUR_IN_MS = 36e5;
const SATURDAY_INDEX = 6;
const SUNDAY_INDEX = 0;
const getDurationInHours = (startDate, endDate) => Math.floor((endDate.getTime() - startDate.getTime()) / toMs("hour"));
export const getDatesWithoutTime = (min, max) => {
    const newMin = dateUtils.trimTime(min);
    const newMax = dateUtils.trimTime(max);
    newMax.setDate(newMax.getDate() + 1);
    return [newMin, newMax]
};
export const getAppointmentRenderingStrategyName = viewType => {
    const {
        renderingStrategy: renderingStrategy
    } = {
        day: {
            renderingStrategy: "vertical"
        },
        week: {
            renderingStrategy: "week"
        },
        workWeek: {
            renderingStrategy: "week"
        },
        month: {
            renderingStrategy: "horizontalMonth"
        },
        timelineDay: {
            renderingStrategy: "horizontal"
        },
        timelineWeek: {
            renderingStrategy: "horizontal"
        },
        timelineWorkWeek: {
            renderingStrategy: "horizontal"
        },
        timelineMonth: {
            renderingStrategy: "horizontalMonthLine"
        },
        agenda: {
            renderingStrategy: "agenda"
        }
    } [viewType];
    return renderingStrategy
};
export const getAppointmentTakesAllDay = (appointmentAdapter, allDayPanelMode) => {
    const {
        startDate: startDate,
        endDate: endDate,
        allDay: allDay
    } = appointmentAdapter;
    switch (allDayPanelMode) {
        case "hidden":
            return false;
        case "allDay":
            return allDay;
        default:
            if (allDay) {
                return true
            }
            if (!isDefined(endDate)) {
                return false
            }
            return getDurationInHours(startDate, endDate) >= 24
    }
};
export const getAppointmentKey = geometry => {
    const {
        left: left,
        top: top,
        width: width,
        height: height
    } = geometry;
    return `${left}-${top}-${width}-${height}`
};
export const hasResourceValue = (resourceValues, itemValue) => isDefined(resourceValues.find((value => equalByValue(value, itemValue))));
export const getOverflowIndicatorColor = (color, colors) => !colors.length || 0 === colors.filter((item => item !== color)).length ? color : void 0;
export const getVerticalGroupCountClass = groups => {
    switch (null === groups || void 0 === groups ? void 0 : groups.length) {
        case 1:
            return VERTICAL_GROUP_COUNT_CLASSES[0];
        case 2:
            return VERTICAL_GROUP_COUNT_CLASSES[1];
        case 3:
            return VERTICAL_GROUP_COUNT_CLASSES[2];
        default:
            return
    }
};
export const setOptionHour = (date, optionHour) => {
    const nextDate = new Date(date);
    if (!isDefined(optionHour)) {
        return nextDate
    }
    nextDate.setHours(optionHour, optionHour % 1 * 60, 0, 0);
    return nextDate
};
export const calculateDayDuration = (startDayHour, endDayHour) => endDayHour - startDayHour;
export const getStartViewDateTimeOffset = (startViewDate, startDayHour) => {
    const validStartDayHour = Math.floor(startDayHour);
    const isDSTChange = timeZoneUtils.isTimezoneChangeInDate(startViewDate);
    if (isDSTChange && validStartDayHour !== startViewDate.getHours()) {
        return dateUtils.dateToMilliseconds("hour")
    }
    return 0
};
export const getValidCellDateForLocalTimeFormat = (date, _ref) => {
    let {
        startViewDate: startViewDate,
        startDayHour: startDayHour,
        cellIndexShift: cellIndexShift,
        viewOffset: viewOffset
    } = _ref;
    const originDate = dateUtilsTs.addOffsets(date, [-viewOffset]);
    const localTimeZoneChangedInOriginDate = timeZoneUtils.isTimezoneChangeInDate(originDate);
    if (!localTimeZoneChangedInOriginDate) {
        return date
    }
    const startViewDateWithoutDST = new Date(new Date(startViewDate).setDate(startViewDate.getDate() + 2));
    const startViewDateOffset = getStartViewDateTimeOffset(startViewDate, startDayHour);
    return dateUtilsTs.addOffsets(startViewDateWithoutDST, [viewOffset, cellIndexShift, -startViewDateOffset])
};
export const getTotalCellCountByCompleteData = completeData => completeData[completeData.length - 1].length;
export const getDisplayedCellCount = (displayedCellCount, completeData) => displayedCellCount ?? getTotalCellCountByCompleteData(completeData);
export const getHeaderCellText = (headerIndex, date, headerCellTextFormat, getDateForHeaderText, additionalOptions) => {
    const validDate = getDateForHeaderText(headerIndex, date, additionalOptions);
    return dateLocalization.format(validDate, headerCellTextFormat)
};
export const isVerticalGroupingApplied = (groups, groupOrientation) => groupOrientation === VERTICAL_GROUP_ORIENTATION && !!groups.length;
export const getGroupCount = groups => {
    let result = 0;
    for (let i = 0, len = groups.length; i < len; i += 1) {
        if (!i) {
            result = groups[i].items.length
        } else {
            result *= groups[i].items.length
        }
    }
    return result
};
export const getHorizontalGroupCount = (groups, groupOrientation) => {
    const groupCount = getGroupCount(groups) || 1;
    const isVerticalGrouping = isVerticalGroupingApplied(groups, groupOrientation);
    return isVerticalGrouping ? 1 : groupCount
};
export const isTimelineView = viewType => !!TIMELINE_VIEWS[viewType];
export const isDateAndTimeView = viewType => viewType !== VIEWS.TIMELINE_MONTH && viewType !== VIEWS.MONTH;
export const isHorizontalView = viewType => {
    switch (viewType) {
        case VIEWS.TIMELINE_DAY:
        case VIEWS.TIMELINE_WEEK:
        case VIEWS.TIMELINE_WORK_WEEK:
        case VIEWS.TIMELINE_MONTH:
        case VIEWS.MONTH:
            return true;
        default:
            return false
    }
};
export const isDateInRange = (date, startDate, endDate, diff) => diff > 0 ? dateUtils.dateInRange(date, startDate, new Date(endDate.getTime() - 1)) : dateUtils.dateInRange(date, endDate, startDate, "date");
export const isFirstCellInMonthWithIntervalCount = (cellDate, intervalCount) => 1 === cellDate.getDate() && intervalCount > 1;
export const getViewStartByOptions = (startDate, currentDate, intervalDuration, startViewDate) => {
    if (!startDate) {
        return new Date(currentDate)
    }
    let currentStartDate = dateUtils.trimTime(startViewDate);
    const diff = currentStartDate.getTime() <= currentDate.getTime() ? 1 : -1;
    let endDate = new Date(currentStartDate.getTime() + intervalDuration * diff);
    while (!isDateInRange(currentDate, currentStartDate, endDate, diff)) {
        currentStartDate = endDate;
        endDate = new Date(currentStartDate.getTime() + intervalDuration * diff)
    }
    return diff > 0 ? currentStartDate : endDate
};
export const calculateIsGroupedAllDayPanel = (groups, groupOrientation, isAllDayPanelVisible) => isVerticalGroupingApplied(groups, groupOrientation) && isAllDayPanelVisible;
export const calculateViewStartDate = startDateOption => startDateOption;
export const getCellDuration = (viewType, startDayHour, endDayHour, hoursInterval) => {
    switch (viewType) {
        case "month":
            return 36e5 * calculateDayDuration(startDayHour, endDayHour);
        case "timelineMonth":
            return dateUtils.dateToMilliseconds("day");
        default:
            return 36e5 * hoursInterval
    }
};
export const calculateCellIndex = (rowIndex, columnIndex, rowCount) => columnIndex * rowCount + rowIndex;
export const getTotalRowCountByCompleteData = completeData => completeData.length;
export const getDisplayedRowCount = (displayedRowCount, completeData) => displayedRowCount ?? getTotalRowCountByCompleteData(completeData);
export const getStartViewDateWithoutDST = (startViewDate, startDayHour) => {
    const newStartViewDate = timeZoneUtils.getDateWithoutTimezoneChange(startViewDate);
    newStartViewDate.setHours(startDayHour);
    return newStartViewDate
};
export const getIsGroupedAllDayPanel = (hasAllDayRow, isVerticalGrouping) => hasAllDayRow && isVerticalGrouping;
export const getKeyByGroup = (groupIndex, isVerticalGrouping) => {
    if (isVerticalGrouping && !!groupIndex) {
        return groupIndex.toString()
    }
    return "0"
};
export const getToday = (indicatorTime, timeZoneCalculator) => {
    const todayDate = indicatorTime ?? new Date;
    return (null === timeZoneCalculator || void 0 === timeZoneCalculator ? void 0 : timeZoneCalculator.createDate(todayDate, {
        path: "toGrid"
    })) || todayDate
};
export const getCalculatedFirstDayOfWeek = firstDayOfWeekOption => isDefined(firstDayOfWeekOption) ? firstDayOfWeekOption : dateLocalization.firstDayOfWeekIndex();
export const isHorizontalGroupingApplied = (groups, groupOrientation) => groupOrientation === HORIZONTAL_GROUP_ORIENTATION && !!groups.length;
export const isGroupingByDate = (groups, groupOrientation, groupByDate) => {
    const isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation);
    return groupByDate && isHorizontalGrouping
};
export const getSkippedHoursInRange = (startDate, endDate, allDay, viewDataProvider) => {
    const isAllDay = allDay && !viewDataProvider.viewType.includes("timeline");
    let result = 0;
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(0, 0, 0, 0);
    const endDateWithStartHour = new Date(endDate);
    endDateWithStartHour.setHours(0, 0, 0, 0);
    const {
        startDayHour: startDayHour,
        endDayHour: endDayHour
    } = viewDataProvider.getViewOptions();
    const dayHours = isAllDay ? 24 : endDayHour - startDayHour;
    while (currentDate < endDateWithStartHour) {
        if (viewDataProvider.isSkippedDate(currentDate)) {
            result += dayHours
        }
        currentDate.setDate(currentDate.getDate() + 1)
    }
    const startDateHours = startDate.getHours();
    const endDateHours = endDate.getHours() + Math.ceil(endDate.getTime() % 36e5);
    if (viewDataProvider.isSkippedDate(startDate)) {
        if (isAllDay) {
            result += 24
        } else if (startDateHours < startDayHour) {
            result += dayHours
        } else if (startDateHours < endDayHour) {
            result += endDayHour - startDateHours
        }
    }
    if (viewDataProvider.isSkippedDate(endDate)) {
        if (isAllDay) {
            result += 24
        } else if (endDateHours > endDayHour) {
            result += dayHours
        } else if (endDateHours > startDayHour) {
            result += endDateHours - startDayHour
        }
    }
    return result
};
export const isDataOnWeekend = date => {
    const day = date.getDay();
    return 6 === day || 0 === day
};
export const getWeekendsCount = days => 2 * Math.floor(days / 7);
export const extendGroupItemsForGroupingByDate = (groupRenderItems, columnCountPerGroup) => [...new Array(columnCountPerGroup)].reduce(((currentGroupItems, _, index) => groupRenderItems.map(((groupsRow, rowIndex) => {
    const currentRow = currentGroupItems[rowIndex] || [];
    return [...currentRow, ...groupsRow.map(((item, columnIndex) => _extends({}, item, {
        key: `${item.key}_group_by_date_${index}`,
        isFirstGroupCell: 0 === columnIndex,
        isLastGroupCell: columnIndex === groupsRow.length - 1
    })))]
}))), []);
export const getGroupPanelData = (groups, columnCountPerGroup, groupByDate, baseColSpan) => {
    let repeatCount = 1;
    let groupPanelItems = groups.map((group => {
        const result = [];
        const {
            name: resourceName,
            items: items,
            data: data
        } = group;
        for (let iterator = 0; iterator < repeatCount; iterator += 1) {
            result.push(...items.map(((_ref2, index) => {
                let {
                    id: id,
                    text: text,
                    color: color
                } = _ref2;
                return {
                    id: id,
                    text: text,
                    color: color,
                    key: `${iterator}_${resourceName}_${id}`,
                    resourceName: resourceName,
                    data: null === data || void 0 === data ? void 0 : data[index]
                }
            })))
        }
        repeatCount *= items.length;
        return result
    }));
    if (groupByDate) {
        groupPanelItems = extendGroupItemsForGroupingByDate(groupPanelItems, columnCountPerGroup)
    }
    return {
        groupPanelItems: groupPanelItems,
        baseColSpan: baseColSpan
    }
};
export const splitNumber = (value, splitValue) => Array.from({
    length: Math.ceil(value / splitValue)
}, ((_, index) => Math.min(value - splitValue * index, splitValue)));
