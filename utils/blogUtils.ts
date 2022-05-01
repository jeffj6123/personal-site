import { Blog } from "contentlayer/generated"

export const postContainsText = (post: Blog, text:string): boolean => {
    return (post.title + post.summary).includes(text);
}