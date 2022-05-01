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
            <Image src={currentImage} className="inner-image"  width="100%" height="100%" layout="responsive" objectFit="contain"></Image>
        </div>

        <div className="image-list-container">
            {props.images.map(url => <div className="image-preview">
                <Image src={url} width='100%' height='100%'></Image>
            </div>)}
        </div>
    </div>)
}