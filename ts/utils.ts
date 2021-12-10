import { darkMode, lightMode } from "./constants";

export const camelCaseToSnakeCase = (text: string) => {
    return text.split("").map(char => {
        if(char === char.toUpperCase()) {
            return "-" + char.toLowerCase()
        }else{
            return char;
        }
    }).join("")
}

export const applyCSSVars = (nightMode: boolean = true) => {
    let root = document.documentElement;

    let css = darkMode;
    if(!nightMode) {
        css = lightMode;
    }

    Object.keys(css).forEach(key => {
        console.log(`--${camelCaseToSnakeCase(key)}`)
        root.style.setProperty(`--${camelCaseToSnakeCase(key)}`, css[key]);
    })
}


export const getFromLocalStorage = (key: string, defaultValue: string) => {
    const item = window.localStorage.getItem(key);

    if(item?.length > 0) {
        return item;
    }else{
        return defaultValue;
    }
}

export const setLocalStorage = (key: string, value: string) => {
    window.localStorage.setItem(key, value);
}