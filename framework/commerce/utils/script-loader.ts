export enum ScriptLoaderType {
    URL = 1,
    TEXT = 2
}

export const scriptElementLoader = (element: any, insertAtTop: boolean, attrs?: object, node?: HTMLElement, skip?: boolean) => {
    //debugger;
    const loadScript = (element: any, insertAtTop: boolean, attrs?: object, parentNode?: HTMLElement) => {
        return new Promise((resolve, reject) => {
            //const script = Object.create(element); // JSON.parse(JSON.stringify(element));

            for (const [k, v] of Object.entries(attrs || {})) {
                element.setAttribute(k, v);
            }

            element.onload = () => {
                element.onerror = element.onload = null;
                resolve(element);
            }

            element.onerror = () => {
                element.onerror = element.onload = null;
                reject(new Error(`Failed to load script`));
            }

            const node = parentNode || document.head || document.getElementsByTagName('head')[0];
            if (insertAtTop) {
                node.insertBefore(element, node.firstChild);
            } else {
                node.appendChild(element);
            }
        });
    };

    if (!skip) {
        return loadScript(element, insertAtTop, attrs, node)
            .then(script => {
                return { script: script as HTMLScriptElement };
            })
            .catch((e: { message: string }) => {
                console.error(e);
                return { error: e };
            });
    }

    return {};
};

export const scriptLoader = (type: ScriptLoaderType, content: string, attrs?: object, node?: HTMLElement, skip?: boolean) => {
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

    const scripts: HTMLScriptElement[] = Array.from(document.scripts);
    for (let i = 0; i < scripts.length; i++) {

        if (type === ScriptLoaderType.URL) {
            if (scripts[i].src.includes(content)) {
                return;
            }
        } else if (type === ScriptLoaderType.TEXT) {
            if (scripts[i].text.includes(content)) {
                return;
            }
        }
    }
    if (!skip) {
        return loadScript(type, content, attrs, node)
            .then(script => {
                return { script: script as HTMLScriptElement };
            })
            .catch((e: { message: string }) => {
                console.error(e);
                return { error: e };
            });
    }

    return {};
};