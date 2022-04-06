import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import getPosts from '../scripts/fileSystem';

export interface IPostListProps {
    posts: any[];
}

export default function PostsList(props: IPostListProps) {
    return (<div>
        {JSON.stringify(props.posts[0])}
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