import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface IPost {
  content: string;
  id: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
}

export const loadBlogProperties = async (fileNamePath: string) => {
  const file = fileNamePath.split('/').pop();

  const location = path.join(process.cwd(), 'pages', 'posts', file)
  
  const fileContent = await fs.promises.readFile(location, 'utf-8');
  const { data, content } = matter(fileContent);

  const id = file.replace(/.mdx$/, '');

  return { content, id, title: data.title, summary: data.summary, tags: data.tags.split(','), date: data.date };
} 

const getPosts = async (limit: number): Promise<IPost[]> => {
  const dirFiles = fs.readdirSync(path.join(process.cwd(), 'pages', 'posts'), {
    withFileTypes: true,
  }).filter(file => file.name.endsWith('.mdx'));

  const posts = await Promise.all(dirFiles
    .map(async (file) => {
      return await loadBlogProperties(file.name);
    }));

  return posts
};

export default getPosts;