import { nightModeStorageKey } from "../logic/constants";
import { getFromLocalStorage } from "../logic/utils";
import { NightMode } from "./toggle";

export interface GitGistProps {
    embedUrl: string;
}

export function GitGist(props: GitGistProps) {
    const darkMode = +getFromLocalStorage(nightModeStorageKey, "1") > 0;
    const url = `<script src="https://emgithub.com/embed.js?target=${props.embedUrl}&style=${NightMode ? 'a11y-dark' : 'github'}&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>`
    return (<div dangerouslySetInnerHTML={{ __html: url }}>
    </div>)
}