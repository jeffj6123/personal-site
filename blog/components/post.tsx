import { Tag } from "../pages/blog/[id]";

export interface IPost {
    title: string;
    date: Date;
    summary: string;
    tags: string[]
}

export interface PostProps {
    post: IPost;
}

export default function Post(props: PostProps) {
    const tags = [{ name: 'React' }, { name: 'Node js' }, { name: 'Datastore' }]

    return (<div className="main-bg shadow card post">
        <h2 className="underline">
            {props.post.title}
        </h2>
        <div>
            {props.post.date}
        </div>
        <div style={{paddingTop: '10px'}}>
            {props.post.summary}
        </div>

        <div className="tag-container reverse">
            {tags.map(tag => <Tag name={tag.name} key={tag.name}></Tag>)}
        </div>
        {/* <div className="tag-container">
            {props.post.tags.map(tag => <Tag name={tag}></Tag>)}
        </div> */}
        {/* <div>
            {props.post.tags}
        </div> */}
        {/* {JSON.stringify(props.post)} */}
    </div>)
}