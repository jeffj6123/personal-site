import Image from "next/image";
import React, { useRef, useState } from "react";

export interface ImageGalleryImage {
    location: string;
}

export interface ImageGalleryProps {
    images: string[];
}

export function ImageGallery(props: ImageGalleryProps) {
    const [currentImage, setCurrentImage ] = useState(0);
    const inputElement = useRef<HTMLDivElement>();

    console.log(inputElement)
    inputElement.current?.scrollIntoView({  behavior: 'smooth', inline: 'center'
});

    return (<div className="image-gallery">
        <div className="selected-image"> 
            <img src={props.images[currentImage]} className="inner-image"></img>
        </div>

        {props.images.length > 1 && 
        <div style={{"display": 'flex', gap: '5px'}}>
            <div className="arrow-container">
                <button className="arrow rotated ri-arrow-right-circle-line" disabled={currentImage === 0}
                        onClick={() => {setCurrentImage(currentImage - 1);}}></button>
            </div>
            <div className="image-list-container">
                {props.images.map((url, index) => <div key={index} ref={index === currentImage ? inputElement : null}>
                    <img src={url} className={`image-preview ${index === currentImage ? 'active': ''}`}
                    onClick={() => {setCurrentImage(index); }} ></img>
                </div>)}
            </div>
            <div className="arrow-container ">
                <button className="arrow ri-arrow-right-circle-line" disabled={currentImage === props.images.length - 1}
                        onClick={() => {setCurrentImage(currentImage + 1); }}></button>
            </div>
        </div>}
    </div>)
}