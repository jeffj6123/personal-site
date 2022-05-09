import Image from "next/image";
import React, { useState } from "react";

export interface ImageGalleryImage {
    location: string;
}

export interface ImageGalleryProps {
    images: string[];
}

export function ImageGallery(props: ImageGalleryProps) {
    const [currentImage, setCurrentImage ] = useState(0);

    return (<div className="image-gallery">
        <div className="selected-image"> 
            <img src={props.images[currentImage]} className="inner-image"></img>
        </div>

        <div className="image-list-container">
            {props.images.map((url, index) => <div key={index}>
                <img src={url} className={`image-preview ${index === currentImage ? 'active': ''}`}
                onClick={() => {setCurrentImage(index); }}></img>
            </div>)}
        </div>
    </div>)
}