import React from 'react';

export interface TagsListProp {
    tags: ITag[];
}

export function TagsList(props: TagsListProp) {
    return (<div className="tag-container">
        {props.tags.map(tag => <Tag tag={tag} key={tag.id}></Tag>)}
    </div>)
}

export interface ITag {
    id: string;
    display: React.ReactNode;
    class?: string;
}

export interface TagProp {
    tag: ITag;
}

export function Tag(props: TagProp) {
    return (<span className={`tag ${props.tag.class}`}>{props.tag.display}</span>)
}