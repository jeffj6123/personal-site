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
    const [scrollImage, setScrollImage ] = useState(1); //set scroll image one ahead to handle the ref being "one" behind

    const inputElement = useRef<HTMLDivElement>();
    const wrapperElement = useRef<HTMLDivElement>();

    if(inputElement.current) {
        let element;
        if(scrollImage > currentImage) {
            element = inputElement.current.nextElementSibling;
        }else{
            element = inputElement.current.previousElementSibling;
        }

        element = element as HTMLDivElement || inputElement.current;

        wrapperElement.current.previousSibling
        wrapperElement.current.scrollTo({
            top: 0,
            left: element.offsetLeft - element.clientWidth, 
            behavior: 'smooth'
          });
    }

    const updateImage = (index: number) => {
        let currentScrollImage = scrollImage;
        if(index > currentImage) {
            currentScrollImage = Math.min(index + 1, props.images.length - 1);
        }else{
            currentScrollImage = Math.max(index - 2, 0);
        }
        setCurrentImage(index);
        setScrollImage(currentScrollImage);
    }

    return (<div className="image-gallery">
        <div className="selected-image"> 
            <img src={props.images[currentImage]} className="inner-image"></img>
        </div>

        {props.images.length > 1 && 
        <div style={{"display": 'flex', gap: '5px'}}>
            <div className="arrow-container">
                <button className="arrow rotated ri-arrow-right-circle-line" disabled={currentImage === 0}
                        onClick={() => {updateImage(currentImage - 1);}}></button>
            </div>
            <div className="image-list-container" ref={wrapperElement}>
                {props.images.map((url, index) => <div key={index} ref={index === currentImage ? inputElement : null}>
                    <img src={url} className={`image-preview ${index === currentImage ? 'active': ''}`}
                    onClick={() => {updateImage(index); }} ></img>
                </div>)}
            </div>
            <div className="arrow-container ">
                <button className="arrow ri-arrow-right-circle-line" disabled={currentImage === props.images.length - 1}
                        onClick={() => {updateImage(currentImage + 1); }}></button>
            </div>
        </div>}
    </div>)
}