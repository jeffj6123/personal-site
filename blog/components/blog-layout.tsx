import React from "react";
export interface TagProps {
    name: string;
}

function Tag(props: TagProps){
    return (<span className="tag">{props.name}</span>)
}

export interface BlogLayoutProps {
    children: React.ReactNode; 
}

export function BlogLayout(props: BlogLayoutProps) {
    const tags = [{ name: 'React' }, { name: 'Node js' }, { name: 'Datastore' }]
    return (<div className="layout-container">
        <h1 className="blog-title">Building A SouthPark Site</h1>
        <div className="underline"></div>
        <div className="tag-container">
            {tags.map(tag => <Tag name={tag.name} key={tag.name}></Tag>)}
        </div>

        <div className="blog-content">
            {props.children}
        </div>

    </div>)
}