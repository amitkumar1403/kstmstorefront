// Base Imports
import { useEffect, useState } from 'react';

export enum ScriptLoaderType {
    URL = 1,
    TEXT = 2
}

export const useScriptLoader = (type: ScriptLoaderType, content: string, attrs?: object, node?: HTMLElement, skip?: boolean) => {
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState({});
    const [scriptReference, setScriptReference] = useState({});

    const loadScript = (type: ScriptLoaderType, content: string, attrs?: object, parentNode?: HTMLElement) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.async = true;
            if (type === ScriptLoaderType.URL) {
                script.src = content;
            } else if (type === ScriptLoaderType.TEXT) {
                script.text = content;
            }
            

            for (const [k, v] of Object.entries(attrs || {})) {
                script.setAttribute(k, v);
            }

            script.onload = () => {
                script.onerror = script.onload = null;
                resolve(script);
            }

            script.onerror = () => {
                script.onerror = script.onload = null;
                reject(new Error(`Failed to load ${content}`));
            }

            const node = parentNode || document.head || document.getElementsByTagName('head')[0];
            node.appendChild(script);
        })
    };


    useEffect(() => {
        const scripts: HTMLScriptElement[] = Array.from(document.scripts);
        for (let i = 0; i < scripts.length; i++) {

            if (type === ScriptLoaderType.URL) {
                if (scripts[i].src.includes(content)) {
                    setIsLoading(false);
                    return;
                }
            } else if (type === ScriptLoaderType.TEXT) {
                if (scripts[i].text.includes(content)) {
                    setIsLoading(false);
                    return;
                }
            }
        }
        if (!skip) {
            loadScript(type, content, attrs, node)
                .then(script => {
                    setIsLoading(false);
                    setScriptReference(script as HTMLScriptElement);
                })
                .catch((e: { message: string }) => {
                    console.error(e);
                    setError(e);
                })
        } else {
            setIsLoading(false);
        }
    }, []);

    return [loading, scriptReference, error];
};