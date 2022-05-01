import Image from "next/image";
import React, { useState } from "react";

export interface ImageGalleryImage {
    location: string;
}

export interface ImageGalleryProps {
    images: string[];
}

export function ImageGallery(props: ImageGalleryProps) {
    const [currentImage, setCurrentImage ] = useState(props.images[0]);

    return (<div className="image-gallery">
        <div className="selected-image"> 
            <Image src={currentImage}></Image>
        </div>

        <div className="image-list-container">
            {props.images.map(url => <div className="image-preview">
                <Image src={url}></Image>
            </div>)}
        </div>
    </div>)
}