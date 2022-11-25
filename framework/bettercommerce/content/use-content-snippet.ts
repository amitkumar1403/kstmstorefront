// Base Imports
import { useEffect } from "react";

// Other Imports
import { insertAdjacentHTML } from "@commerce/utils";
import { GUIDType } from "@commerce/types";

export enum SnippetContentType {
    JAVASCRIPT = "Javascript",
    HTML = "Html",
    TEXT = "Text"
}

enum SnippetPlacementType {
    HEAD_AFTER_OPEN = "TopHead",
    HEAD_BEFORE_CLOSE = "Head",
    ERROR_HEAD = "ErrorHead", // TODO: Introduce error page in better storefront first.
    BODY_AFTER_OPEN = "BodyStartHtmlTagAfter",
    BODY_BEFORE_CLOSE = "BodyEndHtmlTagBefore",
    PAGE_CONTAINER_AFTER = "PageContainerAfter",
    HEADER_MENU_BEFORE = "HeaderMenuBefore",
    HEADER_MENU_AFTER = "HeaderMenuAfter",
    FOOTER_BEFORE = "FooterBefore",
    FOOTER_AFTER = "FooterAfter",
    //H1 = "H1", // Not used
    PRODUCT_AND_BRAND_DESC = "ProductAndBrandDescription", // Inject after product details display section.
    //SITE_LOGO = "SiteLogo", // Obsolete
    ORDER_CONFIRMATION = "OrderConfirmationAfterProgressBar" // Inject before footer on thank you page.
}

interface ISnippet {
    readonly name: string;
    readonly type: string;
    readonly placement: string;
    readonly content: string;
    readonly excludedUrl?: string | null;
    readonly microsites: Array<GUIDType>;
}

/**
 * Suffix for attribute name.
 */
export const ELEM_ATTR = "data-bc-snippet-";

/**
 * Attribute names for snippet injections inside <head>.
 */
const HEAD_ELEM_SELECTORS = ["top-head", "head"];

/**
 * Attribute names for snippet injections inside <body>.
 */
const BODY_ELEM_SELECTORS = ["body-start", "body-end"];

/**
 * Attribute names for snippet injections inside <main>.
 */
const PAGE_CONTAINER_ELEM_SELECTORS = ["page-container-after"];

/**
 * Attribute names for snippet injections around <header>.
 */
const HEADER_MENU_ELEM_SELECTORS = ["header-before-start", "header-after-end"];

/**
 * Attribute names for snippet injections around <header>.
 */
const FOOTER_ELEM_SELECTORS = ["footer-before-start", "footer-after-end"];

/**
 * /// Obsolete ///
 * Attribute names for snippet injections around site log.
 * 
 */
const SITE_LOGO_ELEM_SELECTORS = ["site-logo"];

/**
 * Attribute names for snippet injections inside pdp page.
 */
export const PDP_ELEM_SELECTORS = ["pdp"];

/**
 * Attribute names for snippet injections inside thank you page.
 */
export const ORDER_CONFIRMATION_AFTER_PROGRESS_BAR_ELEM_SELECTORS = ["ordconf-aftprgbar"];

const useContentSnippet = (snippets: Array<ISnippet>): void => {
    
    const injectSnippets = (snippets: Array<ISnippet>): void => {
        //console.log(snippets);
        if (snippets && snippets.length) {
            try {

                snippets.forEach((snippet: ISnippet) => {
                    //console.log(snippet);
                    if (snippet.content) {
                        if (snippet.placement === SnippetPlacementType.HEAD_AFTER_OPEN) { // For "TopHead"

                            topHead(snippet);
                        } else if (snippet.placement === SnippetPlacementType.HEAD_BEFORE_CLOSE) { // For "Head"

                            head(snippet);
                        } else if (snippet.placement === SnippetPlacementType.BODY_AFTER_OPEN) { // For "BodyStartHtmlTagAfter"

                            bodyStartHtmlTagAfter(snippet);
                        } else if (snippet.placement === SnippetPlacementType.BODY_BEFORE_CLOSE) { // For "BodyEndHtmlTagBefore"

                            bodyEndHtmlTagBefore(snippet);
                        } else if (snippet.placement === SnippetPlacementType.PAGE_CONTAINER_AFTER) { // For "PageContainerAfter"

                            pageContainerAfter(snippet);
                        } else if (snippet.placement === SnippetPlacementType.HEADER_MENU_BEFORE) { // For "HeaderMenuBefore"

                            headerMenuBefore(snippet);
                        } else if (snippet.placement === SnippetPlacementType.HEADER_MENU_AFTER) { // For "HeaderMenuAfter"

                            HeaderMenuAfter(snippet);
                        } else if (snippet.placement === SnippetPlacementType.FOOTER_BEFORE) { // For "FooterBefore"

                            footerBefore(snippet);
                        } else if (snippet.placement === SnippetPlacementType.FOOTER_AFTER) { // For "FooterAfter"

                            footerAfter(snippet);
                        } /*else if (snippet.placement === SnippetPlacementType.SITE_LOGO) { // For "SiteLogo"
    
                            siteLogo(snippet);
                        }*/ else if (snippet.placement === SnippetPlacementType.PRODUCT_AND_BRAND_DESC) { // For "ProductAndBrandDescription"

                            productAndBrandDescription(snippet);
                        } else if (snippet.placement === SnippetPlacementType.ORDER_CONFIRMATION) { // For "OrderConfirmationAfterProgressBar"

                            orderConfirmationAfterProgressBar(snippet);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
            }
        }
    };

    useEffect(() => {
        //debugger;
        resetSnippetElements();
        injectSnippets(snippets);
    }, [snippets]);
}

/**
 * Inject first child inside <head>.
 * @param elements 
 */
const topHead = (snippet: ISnippet) => {
    const headElem: any = document.querySelector("head");
    const attrs = buildAttrs([HEAD_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, snippet.type, headElem, attrs, "afterbegin");
};

/**
 * Inject last child inside <head>.
 * @param elements 
 */
const head = (snippet: ISnippet) => {
    const headElem: any = document.querySelector("head");
    const attrs = buildAttrs([HEAD_ELEM_SELECTORS[1]]);
    insertAdjacentHTML(snippet.content, snippet.type, headElem, attrs, "beforeend");
};

/**
 * Inject first child inside <body>.
 * @param snippet 
 * @param elements 
 */
const bodyStartHtmlTagAfter = (snippet: ISnippet) => {
    const bodyElem: any = document.querySelector("body");
    const attrs = buildAttrs([BODY_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, snippet.type, bodyElem, attrs, "afterbegin");
};

/**
 * Inject last child inside <body>.
 * @param snippet 
 * @param elements 
 */
const bodyEndHtmlTagBefore = (snippet: ISnippet) => {
    const bodyElem: any = document.querySelector("body");
    const attrs = buildAttrs([BODY_ELEM_SELECTORS[1]]);
    insertAdjacentHTML(snippet.content, snippet.type, bodyElem, attrs, "beforeend");
};

/**
 * Inject after <main>.
 * @param snippet 
 * @param elements 
 */
const pageContainerAfter = (snippet: ISnippet) => {
    const pageContainerElem: any = document.querySelector("main");
    const attrs = buildAttrs([PAGE_CONTAINER_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, snippet.type, pageContainerElem, attrs, "afterend");
};

/**
 * Inject before <header>.
 * @param snippet 
 */
const headerMenuBefore = (snippet: ISnippet) => {
    const headerElem: any = document.querySelector("header");
    const attrs = buildAttrs([HEADER_MENU_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, snippet.type, headerElem, attrs, "beforebegin");
};

/**
 * Inject after <header>.
 * @param snippet 
 */
const HeaderMenuAfter = (snippet: ISnippet) => {
    const headerElem: any = document.querySelector("header");
    const attrs = buildAttrs([HEADER_MENU_ELEM_SELECTORS[1]]);
    insertAdjacentHTML(snippet.content, snippet.type, headerElem, attrs, "afterend");
};

/**
 * Inject before <footer>.
 * @param snippet 
 */
const footerBefore = (snippet: ISnippet) => {
    const footerElem: any = document.querySelector("footer");
    const attrs = buildAttrs([FOOTER_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, snippet.type, footerElem, attrs, "beforebegin");
};

/**
 * Inject after <footer>.
 * @param snippet 
 */
const footerAfter = (snippet: ISnippet) => {
    const footerElem: any = document.querySelector("footer");
    const attrs = buildAttrs([FOOTER_ELEM_SELECTORS[1]]);
    insertAdjacentHTML(snippet.content, snippet.type, footerElem, attrs, "afterend");
};

/**
 * /// Obsolete ///
 * Inject inside site logo.
 * @param snippet 
 */
const siteLogo = (snippet: ISnippet) => {
    const parentElem: any = document.querySelector("div.site-logo");
    const attrs = buildAttrs([SITE_LOGO_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, snippet.type, parentElem, attrs, "beforeend");
};

/**
 * Inject inside product detail page.
 * @param snippet 
 */
const productAndBrandDescription = (snippet: ISnippet) => {
    const parentElem: any = document.querySelector(`.${ELEM_ATTR}${PDP_ELEM_SELECTORS[0]}`);
    const attrs = buildAttrs([PDP_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, snippet.type, parentElem, attrs, "beforeend");
};

const orderConfirmationAfterProgressBar = (snippet: ISnippet) => {
    const parentElem: any = document.querySelector(`.${ELEM_ATTR}${ORDER_CONFIRMATION_AFTER_PROGRESS_BAR_ELEM_SELECTORS[0]}`);
    const attrs = buildAttrs([ORDER_CONFIRMATION_AFTER_PROGRESS_BAR_ELEM_SELECTORS[0]]);
    insertAdjacentHTML(snippet.content, snippet.type, parentElem, attrs, "beforeend");
};

const buildAttrs = (attrSet: Array<string>): object => {
    let attrs: any = {};
    if (attrSet && attrSet.length) {
        attrs = new Object();
        attrSet.forEach(attr => {
            attrs[`${ELEM_ATTR}${attr}`] = "";
        });
    }
    return attrs;
}

const removeInjections = (elemSelectors: Array<string>, parentNode?: HTMLElement) => {
    //debugger;
    let nodes: NodeListOf<Element>;
    const selectors = elemSelectors.map(x => `[${ELEM_ATTR}${x}]`).join(", ");

    if (parentNode) {
        nodes = parentNode.querySelectorAll(selectors);
    } else {
        nodes = document.querySelectorAll(selectors);
    }
    //console.log(nodes);
    if (nodes && nodes.length) {
        nodes.forEach(elem => {
            try {
                const parent = elem.parentElement;
                if (parent) {
                    parent.removeChild(elem);
                }
            } catch (e) {
                // Do nothing
                console.log(e);
            }
        });
    }
};

export const resetSnippetElements = (): void => {
    //debugger;
    const head = document.querySelector("head");
    if (head) {
        // Remove snippet injections in <head>.
        removeInjections(HEAD_ELEM_SELECTORS, head);
    }

    // const body = document.querySelector("body") as HTMLElement;
    // if (body) {
    // Remove snippet injections in <body>.
    removeInjections(BODY_ELEM_SELECTORS);
    removeInjections(HEADER_MENU_ELEM_SELECTORS);
    removeInjections(FOOTER_ELEM_SELECTORS);
    //}
    removeInjections(SITE_LOGO_ELEM_SELECTORS);
    removeInjections(PAGE_CONTAINER_ELEM_SELECTORS);
    removeInjections(PDP_ELEM_SELECTORS);
};

export default useContentSnippet;