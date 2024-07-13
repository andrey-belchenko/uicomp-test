/**
 * DevExtreme (esm/ui/file_manager/ui.file_manager.notification_manager.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import Guid from "../../core/guid";
import $ from "../../core/renderer";
import {
    extend
} from "../../core/utils/extend";
import {
    getImageContainer
} from "../../core/utils/icon";
import FileManagerProgressPanel from "./ui.file_manager.notification.progress_panel";
const FILE_MANAGER_PROGRESS_BOX_CLASS = "dx-filemanager-progress-box";
const FILE_MANAGER_PROGRESS_BOX_ERROR_CLASS = "dx-filemanager-progress-box-error";
const FILE_MANAGER_PROGRESS_BOX_IMAGE_CLASS = "dx-filemanager-progress-box-image";
const FILE_MANAGER_PROGRESS_BOX_WRAPPER_CLASS = "dx-filemanager-progress-box-wrapper";
const FILE_MANAGER_PROGRESS_BOX_COMMON_CLASS = "dx-filemanager-progress-box-common";
const MANAGER_ID_NAME = "__operationInfoManager";
const ACTION_PROGRESS_STATUS = {
    default: "default",
    progress: "progress",
    error: "error",
    success: "success"
};
class NotificationManagerBase {
    constructor(_ref) {
        let {
            onActionProgressStatusChanged: onActionProgressStatusChanged,
            isActual: isActual
        } = _ref;
        this._id = (new Guid).toString();
        this._isActual = isActual || false;
        this._actionProgressStatus = ACTION_PROGRESS_STATUS.default;
        this._raiseActionProgress = onActionProgressStatusChanged
    }
    getId() {
        return this._id
    }
    isActual() {
        return this._isActual
    }
    createErrorDetailsProgressBox($container, item, errorText) {
        const detailsItem = this._createDetailsItem($container, item);
        this.renderError(detailsItem.$wrapper, errorText)
    }
    renderError($container, errorText) {
        $("<div>").text(errorText).addClass("dx-filemanager-progress-box-error").appendTo($container)
    }
    isActionProgressStatusDefault() {
        return this._actionProgressStatus === ACTION_PROGRESS_STATUS.default
    }
    _createDetailsItem($container, item) {
        const $detailsItem = $("<div>").appendTo($container);
        return this._createProgressBox($detailsItem, {
            commonText: item.commonText,
            imageUrl: item.imageUrl
        })
    }
    _createProgressBox($container, options) {
        $container.addClass("dx-filemanager-progress-box");
        if (options.imageUrl) {
            getImageContainer(options.imageUrl).addClass("dx-filemanager-progress-box-image").appendTo($container)
        }
        const $wrapper = $("<div>").addClass("dx-filemanager-progress-box-wrapper").appendTo($container);
        const $commonText = $("<div>").addClass("dx-filemanager-progress-box-common").text(options.commonText).appendTo($wrapper);
        return {
            $commonText: $commonText,
            $element: $container,
            $wrapper: $wrapper
        }
    }
}
class NotificationManagerStub extends NotificationManagerBase {
    addOperation() {
        return {
            [MANAGER_ID_NAME]: this._id
        }
    }
    addOperationDetails() {}
    updateOperationItemProgress() {}
    completeOperationItem() {}
    finishOperation() {}
    completeOperation() {}
    completeSingleOperationWithError() {}
    addOperationDetailsError() {}
    handleDimensionChanged() {
        return false
    }
    ensureProgressPanelCreated() {}
    tryHideActionProgress() {
        this._updateActionProgress("", ACTION_PROGRESS_STATUS.default)
    }
    updateActionProgressStatus() {
        this._updateActionProgress("", ACTION_PROGRESS_STATUS.default)
    }
    _updateActionProgress(message, status) {
        if (status !== ACTION_PROGRESS_STATUS.default && status !== ACTION_PROGRESS_STATUS.progress) {
            return
        }
        this._actionProgressStatus = status;
        this._raiseActionProgress(message, status)
    }
    hasNoOperations() {
        return true
    }
    get _operationInProgressCount() {
        return 0
    }
    set _operationInProgressCount(value) {}
    get _failedOperationCount() {
        return 0
    }
    set _failedOperationCount(value) {}
}
class NotificationManager extends NotificationManagerBase {
    constructor(options) {
        super(options);
        this._failedOperationCount = 0;
        this._operationInProgressCount = 0
    }
    addOperation(processingMessage, allowCancel, allowProgressAutoUpdate) {
        this._operationInProgressCount++;
        const operationInfo = this._progressPanel.addOperation(processingMessage, allowCancel, allowProgressAutoUpdate);
        operationInfo[MANAGER_ID_NAME] = this._id;
        this._updateActionProgress(processingMessage, ACTION_PROGRESS_STATUS.progress);
        return operationInfo
    }
    addOperationDetails(operationInfo, details, showCloseButton) {
        this._progressPanel.addOperationDetails(operationInfo, details, showCloseButton)
    }
    updateOperationItemProgress(operationInfo, itemIndex, itemProgress, commonProgress) {
        this._progressPanel.updateOperationItemProgress(operationInfo, itemIndex, itemProgress, commonProgress)
    }
    completeOperationItem(operationInfo, itemIndex, commonProgress) {
        this._progressPanel.completeOperationItem(operationInfo, itemIndex, commonProgress)
    }
    finishOperation(operationInfo, commonProgress) {
        this._progressPanel.updateOperationCommonProgress(operationInfo, commonProgress)
    }
    completeOperation(operationInfo, commonText, isError, statusText) {
        this._operationInProgressCount--;
        if (isError) {
            this._failedOperationCount++
        }
        this._progressPanel.completeOperation(operationInfo, commonText, isError, statusText)
    }
    completeSingleOperationWithError(operationInfo, errorInfo) {
        this._progressPanel.completeSingleOperationWithError(operationInfo, errorInfo.detailErrorText);
        this._notifyError(errorInfo)
    }
    addOperationDetailsError(operationInfo, errorInfo) {
        this._progressPanel.addOperationDetailsError(operationInfo, errorInfo.itemIndex, errorInfo.detailErrorText);
        this._notifyError(errorInfo)
    }
    handleDimensionChanged() {
        if (this._progressPanel) {
            this._progressPanel.$element().detach()
        }
        return true
    }
    ensureProgressPanelCreated(container, options) {
        if (!this._progressPanel) {
            const $progressPanelElement = $("<div>").appendTo(container);
            const ProgressPanelClass = this._getProgressPanelComponent();
            this._progressPanel = new ProgressPanelClass($progressPanelElement, extend({}, options, {
                onOperationClosed: _ref2 => {
                    let {
                        info: info
                    } = _ref2;
                    return this._onProgressPanelOperationClosed(info)
                }
            }))
        } else {
            this._progressPanel.$element().appendTo(container)
        }
    }
    _getProgressPanelComponent() {
        return FileManagerProgressPanel
    }
    _onProgressPanelOperationClosed(operationInfo) {
        if (operationInfo.hasError) {
            this._failedOperationCount--;
            this.tryHideActionProgress()
        }
    }
    tryHideActionProgress() {
        if (this.hasNoOperations()) {
            this._updateActionProgress("", ACTION_PROGRESS_STATUS.default)
        }
    }
    updateActionProgressStatus(operationInfo) {
        if (operationInfo) {
            const status = 0 === this._failedOperationCount ? ACTION_PROGRESS_STATUS.success : ACTION_PROGRESS_STATUS.error;
            this._updateActionProgress("", status)
        }
    }
    _notifyError(errorInfo) {
        const status = this.hasNoOperations() ? ACTION_PROGRESS_STATUS.default : ACTION_PROGRESS_STATUS.error;
        this._updateActionProgress(errorInfo.commonErrorText, status)
    }
    _updateActionProgress(message, status) {
        this._actionProgressStatus = status;
        this._raiseActionProgress(message, status)
    }
    hasNoOperations() {
        return 0 === this._operationInProgressCount && 0 === this._failedOperationCount
    }
    get _operationInProgressCount() {
        return this._operationInProgressCountInternal
    }
    set _operationInProgressCount(value) {
        this._operationInProgressCountInternal = value
    }
    get _failedOperationCount() {
        return this._failedOperationCountInternal
    }
    set _failedOperationCount(value) {
        this._failedOperationCountInternal = value
    }
}
export {
    NotificationManager,
    NotificationManagerStub,
    MANAGER_ID_NAME
};
