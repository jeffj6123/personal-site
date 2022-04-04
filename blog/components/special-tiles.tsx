import React from 'react';

export function Warning(props: any) {
    return (<div className='blog-banner warning'>
        <div className='banner-icon'>
            <i className="ri-error-warning-line"></i>
        </div>
        <div>
            {props.children}
        </div>
    </div>)
}