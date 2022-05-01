import { ImageGallery } from 'components/post-components/image-gallery';
import { allBlogs, Blog } from 'contentlayer/generated';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { useEffect, useState } from 'react';
import { postContainsText } from 'utils/blogUtils';
import Post from '../components/post';
import { ITag, TagsList } from '../components/tag';

export type Counts = Record<string, number>;

export interface IPostListProps {
    posts: Blog[];
    tags: string[];
}

export default function PostsList(props: IPostListProps) {
    const [selected, setSelected] = useState([]);
    const [filterText, setFilteredText] = useState("");
    const [filteredPosts, setFilteredPosts] = useState(props.posts);

    const tagList: ITag[] = props.tags.map(tag => {
        const isSelected = selected.includes(tag);
        const onClick = ()  => {
            let updatedTags: string[] = [];
            if(isSelected) {
                updatedTags = selected.filter(t => t !== tag)
            }else{
                updatedTags = selected.concat([tag])
            }
            setSelected(updatedTags)
            setFilteredPosts(props.posts.filter(post => updatedTags.every(tag => post.tagList.includes(tag)) && postContainsText(post, filterText)));
        }

        const postCount = filteredPosts.filter(post => post.tagList.includes(tag));
        let backgroundCSS = isSelected ? 'selected-tag': '';
        backgroundCSS += " clickable"
        backgroundCSS += postCount.length > 0 ? '': ' hidden';
        console.log(backgroundCSS)
        return {
            id: tag,
            display: (<span onClick={onClick}>{tag}<span style={{'marginLeft': '5px'}}>{postCount.length}</span></span>),
            class: backgroundCSS,
            count: postCount.length
        }
    }) 
    .sort((a,b) => b.count - a.count)

    const setText = (text: string) => {
        setFilteredPosts(props.posts.filter(post => selected.every(tag => post.tagList.includes(tag)) && postContainsText(post, text)));
    }

    return (<div className='layout-container' style={{paddingTop: '15px'}}>
        <ImageGallery images={['/sfx/sfx-old-one.png']} ></ImageGallery>

        <div className='search-section'>
            <h1 className='post-container'>Most Recent
                <div className='vertical-flex'>
                    <input type='text' className='search-bar' placeholder="Search Posts" onChange={(event) => setText(event.target.value)}></input>
                </div>
            </h1>
            <div className='underline'></div>
            <TagsList tags={tagList}></TagsList>
            {/* <div className='spacer'></div> */}
        </div>
        <div className='post-lists'>
            {filteredPosts.map(post => (<Post key={post.title} post={post}></Post>))}
        </div>
    </div>)
}

export const getStaticProps: GetStaticProps = async (context) => {
    const tags = new Set<string>();
    allBlogs.forEach(post => {
        post.tagList.forEach( (tag: string) => {
            const clean = tag.trim();
            tags.add(clean);
        });
    })

    return {
        props: {
            posts: allBlogs,
            tags: Array.from<string>(tags.keys())
        }
    }
}