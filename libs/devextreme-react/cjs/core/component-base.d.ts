/*!
 * devextreme-react
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file in the root of the project for details.
 *
 * https://github.com/DevExpress/devextreme-react
 */

import * as React from 'react';
import { ReactElement } from 'react';
import { ComponentProps } from './component';
declare const DX_REMOVE_EVENT = "dxremove";
type ComponentBaseProps = ComponentProps & {
    renderChildren?: () => Record<string, unknown>[] | null | undefined;
};
interface ComponentBaseRef {
    getInstance: () => any;
    getElement: () => HTMLDivElement | undefined;
    createWidget: (element?: Element) => void;
}
interface IHtmlOptions {
    id?: string;
    className?: string;
    style?: any;
}
declare const ComponentBase: <P extends IHtmlOptions>(props: P & ComponentProps & {
    renderChildren?: (() => Record<string, unknown>[] | null | undefined) | undefined;
} & {
    ref?: React.Ref<ComponentBaseRef> | undefined;
}) => ReactElement | null;
export { IHtmlOptions, ComponentBaseRef, ComponentBase, ComponentBaseProps, DX_REMOVE_EVENT, };
