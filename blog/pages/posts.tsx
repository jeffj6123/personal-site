import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Post from '../components/post';
import getPosts from '../scripts/fileSystem';

export interface IPostListProps {
    posts: any[];
}

export default function PostsList(props: IPostListProps) {
    return (<div className='layout-container' style={{paddingTop: '15px'}}>
        <h1 className='post-container' >Most Recent
            <div className=''>
                <input type='text' className='search-bar' placeholder="Search Posts"></input>
            </div>
        </h1>
        <div className='underline spacer'></div>
        <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row'}}>
            {props.posts.map(post => (<Post key={post.title} post={post.data}></Post>))}
        </div>
    </div>)
}

export const getStaticProps: GetStaticProps = async (context) => {
    const posts = getPosts(10);

    return {
      props: {
          posts
      }, // will be passed to the page component as props
    }
  }