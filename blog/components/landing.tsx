import { useState } from "react";

export default function LandingText() {
    const [currentText, setText] = useState('website');

    const test = document.getElementById("test");
    let currentIndex = 1;
    const makes = [
        "Websites",
        "Games",
        "prototypes",
        "digital experiences",
        "useful tools"
    ]
    //add when interval starts to avoid delay
    test.classList.add('making-current')
    setInterval(() => {
        test.innerHTML = makes[currentIndex];
        currentIndex++;
        if (currentIndex === makes.length) {
            currentIndex = 1;
        }
    }, 4000)
    return (<span className="highlight-text" id="test">websites</span>)
}