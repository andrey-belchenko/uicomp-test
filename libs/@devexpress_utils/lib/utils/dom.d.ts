import { IPoint, IRectangle, ISize } from '../geometry/interfaces';
export declare class DomUtils {
    private static html2PlainTextFilter;
    private static verticalScrollBarWidth;
    static clearInnerHtml(element: HTMLElement): void;
    static setStylePosition(style: CSSStyleDeclaration, point: IPoint): void;
    static setStyleSize(style: CSSStyleDeclaration, size: ISize): void;
    static setStyleSizeAndPosition(style: CSSStyleDeclaration, rectangle: IRectangle): void;
    static hideNode(node: Node | null | undefined): void;
    static isHTMLElementNode(node: Node): node is HTMLElement;
    static isTextNode(node: Node): boolean;
    static isElementNode(node: Node): node is Element;
    static isHTMLTableRowElement(element: Element): element is HTMLTableRowElement;
    static isItParent(parentElement: Node, element: HTMLElement): boolean;
    static getParentByTagName(element: HTMLElement, tagName: string): HTMLElement | null;
    static getDocumentScrollTop(): number;
    static getDocumentScrollLeft(): number;
    static getCurrentStyle(element: HTMLElement): CSSStyleDeclaration;
    static setFocus(element: HTMLElement): void;
    static hasClassName(element: Element, className: string): boolean;
    static addClassName(element: Element, className: string): void;
    static removeClassName(element: Element, className: string): void;
    static toggleClassName(element: Element, className: string, toggle?: boolean): void;
    static pxToInt(px: string): number;
    static pxToFloat(px: string): number;
    static getAbsolutePositionY(element: HTMLElement): number;
    static getAbsolutePositionX(element: HTMLElement): number;
    static isInteractiveControl(element: HTMLElement): boolean;
    static getClearClientHeight(element: HTMLElement): number;
    static getTopBottomPaddings(element: HTMLElement, style?: CSSStyleDeclaration): number;
    static getVerticalBordersWidth(element: HTMLElement, style?: CSSStyleDeclaration): number;
    static getNodes(parent: Element, predicate: (e: Element) => boolean): Element[];
    static getChildNodes(parent: Element, predicate: (e: ChildNode) => boolean): ChildNode[];
    static getNodesByClassName(parent: Element, className: string): Element[];
    static getChildNodesByClassName(parent: Element, className: string): Element[];
    static getVerticalScrollBarWidth(): number;
    static getHorizontalBordersWidth(element: HTMLElement, style?: CSSStyleDeclaration): number;
    static getFontFamiliesFromCssString(cssString: string): string[];
    static getInnerText(container: HTMLElement): string | null;
}
//# sourceMappingURL=dom.d.ts.map