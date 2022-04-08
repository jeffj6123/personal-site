import React from 'react';

export interface TagsListProp {
    tags: string[];
    counts?: Record<string, number>;
}

export function TagsList(props: TagsListProp) {
    return (<div className="tag-container">
        {props.tags.map(tag => <Tag tag={tag} key={tag}></Tag>)}
    </div>)
}

export interface TagProp {
    tag: string;
    count?: number;
    selected?: boolean;
}

export function Tag(props: TagProp) {
    return (<span className="tag">{props.tag} {props.count !== undefined && <span>
        {props.count}
    </span>}
    </span>)
}