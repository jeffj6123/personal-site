import { useEffect, useRef, useState } from "react";

export default function LandingText() {
    const makes = [
        "Websites",
        "Games",
        "prototypes",
        "digital experiences",
        "useful tools"
    ]

    const [currentIndex, setIndex] = useState(0);
    const currentTextRef = useRef(currentIndex);
    currentTextRef.current = currentIndex;

    useEffect(() => {
        const id = setInterval(() => {
            if (currentTextRef.current === makes.length) {
                setIndex(0);
            }else{
                setIndex(currentTextRef.current + 1);
            }
        }, 4000)

        return () => clearInterval(id);
    })

    return (<span className="highlight-text making-current">{makes[currentIndex]}</span>)
}