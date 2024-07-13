/**
 * DevExtreme (esm/viz/axes/smart_formatter.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import formatHelper from "../../format_helper";
import {
    isDefined,
    isFunction,
    isExponential,
    isObject
} from "../../core/utils/type";
import dateUtils from "../../core/utils/date";
import {
    adjust,
    getPrecision,
    getExponent
} from "../../core/utils/math";
import {
    getAdjustedLog10 as log10
} from "../core/utils";
const _format = formatHelper.format;
const {
    abs: abs,
    floor: floor
} = Math;
const EXPONENTIAL = "exponential";
const formats = ["fixedPoint", "thousands", "millions", "billions", "trillions", EXPONENTIAL];
const dateUnitIntervals = ["millisecond", "second", "minute", "hour", "day", "month", "year"];
const INTERVALS_MAP = {
    week: "day",
    quarter: "month",
    shorttime: "hour",
    longtime: "second"
};

function patchFirstTickDiff(differences, tickFormatIndex) {
    for (let i = tickFormatIndex; i < dateUnitIntervals.length - 1; i++) {
        const dateUnitInterval = dateUnitIntervals[i];
        if (i === tickFormatIndex) {
            setDateUnitInterval(differences, tickFormatIndex + (differences.millisecond ? 2 : 1));
            break
        } else if (differences[dateUnitInterval] && differences.count > 1) {
            resetDateUnitInterval(differences, i);
            break
        }
    }
}

function patchTickDiff(differences, tickFormatIndex) {
    let patched = false;
    for (let i = dateUnitIntervals.length - 1; i >= tickFormatIndex; i--) {
        const dateUnitInterval = dateUnitIntervals[i];
        if (differences[dateUnitInterval]) {
            if (i - tickFormatIndex > 1) {
                for (let j = 0; j <= tickFormatIndex; j++) {
                    resetDateUnitInterval(differences, j);
                    patched = true
                }
                break
            }
        }
    }
    return patched
}

function getDatesDifferences(prevDate, curDate, nextDate, tickIntervalFormat) {
    tickIntervalFormat = INTERVALS_MAP[tickIntervalFormat] || tickIntervalFormat;
    const tickFormatIndex = dateUnitIntervals.indexOf(tickIntervalFormat);
    if (nextDate) {
        const nextDifferences = dateUtils.getDatesDifferences(curDate, nextDate);
        if (nextDifferences[tickIntervalFormat]) {
            patchFirstTickDiff(nextDifferences, tickFormatIndex)
        }
        return nextDifferences
    } else {
        const prevDifferences = dateUtils.getDatesDifferences(prevDate, curDate);
        const patched = patchTickDiff(prevDifferences, tickFormatIndex);
        if (!patched && 1 === prevDifferences.count) {
            setDateUnitInterval(prevDifferences, tickFormatIndex)
        }
        return prevDifferences
    }
}

function resetDateUnitInterval(differences, intervalIndex) {
    const dateUnitInterval = dateUnitIntervals[intervalIndex];
    if (differences[dateUnitInterval]) {
        differences[dateUnitInterval] = false;
        differences.count--
    }
}

function setDateUnitInterval(differences, intervalIndex) {
    const dateUnitInterval = dateUnitIntervals[intervalIndex];
    if (false === differences[dateUnitInterval]) {
        differences[dateUnitInterval] = true;
        differences.count++
    }
}

function getNoZeroIndex(str) {
    return str.length - parseInt(str).toString().length
}

function getTransitionTickIndex(ticks, value) {
    let i;
    let curDiff;
    let minDiff;
    let nearestTickIndex = 0;
    minDiff = abs(value - ticks[0]);
    for (i = 1; i < ticks.length; i++) {
        curDiff = abs(value - ticks[i]);
        if (curDiff < minDiff) {
            minDiff = curDiff;
            nearestTickIndex = i
        }
    }
    return nearestTickIndex
}

function splitDecimalNumber(value) {
    return value.toString().split(".")
}

function createFormat(type) {
    let formatter;
    if (isFunction(type)) {
        formatter = type;
        type = null
    }
    return {
        type: type,
        formatter: formatter
    }
}

function formatLogarithmicNumber(tick) {
    const log10Tick = log10(abs(tick));
    let type;
    if (log10Tick > 0) {
        type = formats[floor(log10Tick / 3)] || EXPONENTIAL
    } else if (log10Tick < -4) {
        type = EXPONENTIAL
    } else {
        return _format(adjust(tick))
    }
    return _format(tick, {
        type: type,
        precision: 0
    })
}

function getDateTimeFormat(tick, _ref) {
    let {
        showTransition: showTransition,
        ticks: ticks,
        tickInterval: tickInterval
    } = _ref;
    let typeFormat = dateUtils.getDateFormatByTickInterval(tickInterval);
    let prevDateIndex;
    let nextDateIndex;
    if (showTransition && ticks.length) {
        const indexOfTick = ticks.map(Number).indexOf(+tick);
        if (1 === ticks.length && 0 === indexOfTick) {
            typeFormat = formatHelper.getDateFormatByTicks(ticks)
        } else {
            if (-1 === indexOfTick) {
                prevDateIndex = getTransitionTickIndex(ticks, tick)
            } else {
                prevDateIndex = 0 === indexOfTick ? ticks.length - 1 : indexOfTick - 1;
                nextDateIndex = 0 === indexOfTick ? 1 : -1
            }
            const datesDifferences = getDatesDifferences(ticks[prevDateIndex], tick, ticks[nextDateIndex], typeFormat);
            typeFormat = formatHelper.getDateFormatByDifferences(datesDifferences, typeFormat)
        }
    }
    return createFormat(typeFormat)
}

function getFormatExponential(tick, tickInterval) {
    const stringTick = abs(tick).toString();
    if (isExponential(tick)) {
        return Math.max(abs(getExponent(tick) - getExponent(tickInterval)), abs(getPrecision(tick) - getPrecision(tickInterval)))
    } else {
        return abs(getNoZeroIndex(stringTick.split(".")[1]) - getExponent(tickInterval) + 1)
    }
}

function getFormatWithModifier(tick, tickInterval) {
    const tickIntervalIndex = floor(log10(tickInterval));
    let tickIndex;
    let precision = 0;
    let actualIndex = tickIndex = floor(log10(abs(tick)));
    if (tickIndex - tickIntervalIndex >= 2) {
        actualIndex = tickIntervalIndex
    }
    let indexOfFormat = floor(actualIndex / 3);
    const offset = 3 * indexOfFormat;
    if (indexOfFormat < 0) {
        indexOfFormat = 0
    }
    const typeFormat = formats[indexOfFormat] || formats[formats.length - 1];
    if (offset > 0) {
        const separatedTickInterval = splitDecimalNumber(tickInterval / Math.pow(10, offset));
        if (separatedTickInterval[1]) {
            precision = separatedTickInterval[1].length
        }
    }
    return {
        precision: precision,
        type: typeFormat
    }
}

function getHighDiffFormat(diff) {
    let stop = false;
    for (const i in diff) {
        if (true === diff[i] || "hour" === i || stop) {
            diff[i] = false;
            stop = true
        } else if (false === diff[i]) {
            diff[i] = true
        }
    }
    return createFormat(formatHelper.getDateFormatByDifferences(diff))
}

function getHighAndSelfDiffFormat(diff, interval) {
    let stop = false;
    for (const i in diff) {
        if (stop) {
            diff[i] = false
        } else if (i === interval) {
            stop = true
        } else {
            diff[i] = true
        }
    }
    return createFormat(formatHelper.getDateFormatByDifferences(diff))
}

function formatDateRange(startValue, endValue, tickInterval) {
    const diff = getDatesDifferences(startValue, endValue);
    const typeFormat = dateUtils.getDateFormatByTickInterval(tickInterval);
    const diffFormatType = formatHelper.getDateFormatByDifferences(diff, typeFormat);
    const diffFormat = createFormat(diffFormatType);
    const values = [];
    if (tickInterval in diff) {
        const rangeFormat = getHighAndSelfDiffFormat(getDatesDifferences(startValue, endValue), tickInterval);
        const value = _format(startValue, rangeFormat);
        if (value) {
            values.push(value)
        }
    } else {
        const rangeFormat = getHighDiffFormat(getDatesDifferences(startValue, endValue));
        const highValue = _format(startValue, rangeFormat);
        if (highValue) {
            values.push(highValue)
        }
        values.push(`${_format(startValue,diffFormat)} - ${_format(endValue,diffFormat)}`)
    }
    return values.join(", ")
}

function processDateInterval(interval) {
    if (isObject(interval)) {
        const dateUnits = Object.keys(interval);
        const sum = dateUnits.reduce(((sum, k) => interval[k] + sum), 0);
        if (1 === sum) {
            const dateUnit = dateUnits.filter((k => 1 === interval[k]))[0];
            return dateUnit.slice(0, dateUnit.length - 1)
        }
    }
    return interval
}
export function smartFormatter(tick, options) {
    let tickInterval = options.tickInterval;
    const stringTick = abs(tick).toString();
    let format = options.labelOptions.format;
    const ticks = options.ticks;
    const isLogarithmic = "logarithmic" === options.type;
    if (1 === ticks.length && 0 === ticks.indexOf(tick) && !isDefined(tickInterval)) {
        tickInterval = abs(tick) >= 1 ? 1 : adjust(1 - abs(tick), tick)
    }
    if (Object.is(tick, -0)) {
        tick = 0
    }
    if (!isDefined(format) && "discrete" !== options.type && tick && (10 === options.logarithmBase || !isLogarithmic)) {
        if ("datetime" !== options.dataType && isDefined(tickInterval)) {
            if (ticks.length && -1 === ticks.indexOf(tick)) {
                const indexOfTick = getTransitionTickIndex(ticks, tick);
                tickInterval = adjust(abs(tick - ticks[indexOfTick]), tick)
            }
            if (isLogarithmic) {
                return formatLogarithmicNumber(tick)
            } else {
                let separatedTickInterval = splitDecimalNumber(tickInterval);
                if (separatedTickInterval < 2) {
                    separatedTickInterval = splitDecimalNumber(tick)
                }
                if (separatedTickInterval.length > 1 && !isExponential(tickInterval)) {
                    format = {
                        type: formats[0],
                        precision: separatedTickInterval[1].length
                    }
                } else if (isExponential(tickInterval) && (-1 !== stringTick.indexOf(".") || isExponential(tick))) {
                    format = {
                        type: EXPONENTIAL,
                        precision: getFormatExponential(tick, tickInterval)
                    }
                } else {
                    format = getFormatWithModifier(tick, tickInterval)
                }
            }
        } else if ("datetime" === options.dataType) {
            format = getDateTimeFormat(tick, options)
        }
    }
    return _format(tick, format)
}
export function formatRange(_ref2) {
    let {
        startValue: startValue,
        endValue: endValue,
        tickInterval: tickInterval,
        argumentFormat: argumentFormat,
        axisOptions: {
            dataType: dataType,
            type: type,
            logarithmBase: logarithmBase
        }
    } = _ref2;
    if ("discrete" === type) {
        return ""
    }
    if ("datetime" === dataType) {
        return formatDateRange(startValue, endValue, processDateInterval(tickInterval))
    }
    const formatOptions = {
        ticks: [],
        type: type,
        dataType: dataType,
        tickInterval: tickInterval,
        logarithmBase: logarithmBase,
        labelOptions: {
            format: argumentFormat
        }
    };
    return `${smartFormatter(startValue,formatOptions)} - ${smartFormatter(endValue,formatOptions)}`
}
