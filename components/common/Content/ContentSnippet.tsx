// Base Imports
import React, { memo } from "react";

// Other Imports
import { useContentSnippet } from "@framework";

const ContentSnippet: React.FC<any> = (props: any) => {
    //debugger;
    const { snippets } = props;
    useContentSnippet(snippets);
    return (
        <></>
    );
};

export default memo(ContentSnippet);