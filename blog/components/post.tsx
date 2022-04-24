import { Blog } from "contentlayer/generated";
import Link from "next/link";
import { ITag, TagsList } from "./tag";

export interface PostProps {
    post: Blog;
}

export default function Post(props: PostProps) {
    const tags: ITag[] = props.post.tagList.map((tag: string) => ({ id: tag, display: tag }))

    return (
        <Link href={props.post.url}>
            <a className="main-bg shadow card post">
                <h2 className="underline">
                    {props.post.title}
                </h2>
                <div>
                    {props.post.date}
                </div>
                <div style={{ paddingTop: '10px' }}>
                    {props.post.summary}
                </div>

                <div className="right-adjusted-tags">
                    <TagsList tags={tags} ></TagsList>
                </div>
            </a>
        </Link>)
}