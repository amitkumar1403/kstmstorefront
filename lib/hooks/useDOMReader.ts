// Base Imports
import { useEffect, useState } from 'react';

// Package Imports
import { DOMParser } from "@xmldom/xmldom";

export enum TagNameType {
    SCRIPT = "SCRIPT",
    STYLE = "STYLE",
    HTML = "HTML",
    OTHER = "OTHER"
}

interface IDomReference {
    readonly content: string;
    readonly type: string;
}

export const useDOMReader = (content: string) => {
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>({});
    const [domReferences, setDOMReferences] = useState<Array<IDomReference>>();

    useEffect(() => {
        const doc = new DOMParser().parseFromString(content, "text/html");
        try {
            if (doc) {
                const domElements = [...doc.head.querySelectorAll("*"), ...doc.body.querySelectorAll("*")];
                if (domElements && domElements.length) {
                    let arrDOM = new Array<IDomReference>();
                    domElements.forEach((elem: any) => {
                        if (elem.tagName === TagNameType.SCRIPT) {
                            arrDOM.push({
                                type: elem.tagName,
                                content: elem.text
                            });
                        } else if (elem.tagName === TagNameType.STYLE) {
                            arrDOM.push({
                                type: elem.tagName,
                                content: elem.textContent
                            });
                        } else {
                            arrDOM.push({
                                type: TagNameType.HTML,
                                content: elem.outerHTML
                            });
                        }
                    });
                    setDOMReferences(arrDOM);
                }
            } else {
                setError("Error parsing DOM input.")
            }
        } catch (e) {
            setIsLoading(false);
            setError(e);
        }

    }, []);

    return { loading, domReferences, error };
}