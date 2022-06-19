import { GetStaticPropsContext } from "next";
import { useMDXComponent } from 'next-contentlayer/hooks';
import { allBlogs, Blog } from 'contentlayer/generated';
import { ITag, TagsList } from "components/tag";

export interface TagProps {
    name: string;
}

export function Tag(props: TagProps){
    return (<span className="tag">{props.name}</span>)
}

//TODO SCORE UPDATER
//MAKE AN UPVOTER THAT SCORES DEPENDING ON HOW MANY LAPS
export default function Post(props: {content: Blog, id: string}) {
        const content = (props.content?.body?.code) || "var Component = function() {}; return Component";

        const Component = useMDXComponent(content)
        const tags: ITag[] = props.content.tagList.map((tag: string) => ({ id: tag, display: tag }))
        return (<div className="layout-container">
            <h1 className="blog-title">{props.content.title}</h1>
            <div className="underline"></div>
            <TagsList tags={tags}></TagsList>
            <div className="blog-content">
                <Component></Component>
            </div>
    
        </div>)
}

export async function getStaticProps(context: GetStaticPropsContext) {
    const post = allBlogs.find(post => post.id === context.params.id);
    return {
        props: {
            id: context.params.id,
            content: post
        },
    }
}

export async function getStaticPaths() {
    return {
        paths: allBlogs.map(post => `/blog/${post.id}`),
        fallback: false,
    }
}