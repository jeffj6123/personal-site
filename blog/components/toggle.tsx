import { useEffect, useState } from "react";
import { nightModeStorageKey } from "../logic/constants";
import { applyCSSVars, getFromLocalStorage, setLocalStorage } from "../logic/utils";

// const setNightMode = () => {
//     const nightModeToggle = document.getElementById("nightmode") as HTMLInputElement;

//     nightModeToggle.checked = +getFromLocalStorage(nightModeStorageKey, "1") > 0;
//     applyCSSVars(nightModeToggle.checked)

//     nightModeToggle.addEventListener('click', () => {
//         applyCSSVars(nightModeToggle.checked)
//         setLocalStorage(nightModeStorageKey, nightModeToggle.checked ? "1" : "0")
//     })
// }

export function NightMode() {
    const [toggled, setToggle] = useState(true);
    useEffect(() => {
        setToggle(+getFromLocalStorage(nightModeStorageKey, "1") > 0);
        applyCSSVars(toggled)
    }, [])

    const changeNightMode = () => {
        applyCSSVars(!toggled)
        setLocalStorage(nightModeStorageKey, !toggled ? "1" : "0")
        setToggle(!toggled);
    }

    return (<div className="checkbox-container">
        <i className="ri-sun-fill nightmode-icons daymode"></i>
        <label className="switch">
            <input type="checkbox" id="nightmode" onClick={() => changeNightMode()}></input>
            <span className="slider round"></span>
        </label>
        <i className="ri-moon-fill nightmode-icons"></i>
    </div>)
}