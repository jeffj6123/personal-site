import { ICSSConfig } from "./interfaces";

export const size = 500;
export const shapeCount = 150;

export const FULL_RADIUS = Math.PI * 2;

export const nightModeStorageKey = "nightmode";

export const darkMode: ICSSConfig = {
    mainBgColor: "rgb(47 46 46)",
    bgColor: "#121212",
    accentColor: "rgb(31 216 114)",
    mainText: "#fff"
}

export const lightMode: ICSSConfig = {
    mainBgColor: "#fff",
    bgColor: "#fdfdfd",
    accentColor: "rgb(31 216 114)",
    mainText: "#000"
}