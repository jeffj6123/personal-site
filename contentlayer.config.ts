import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypePrism from 'rehype-prism-plus'

const Post = defineDocumentType(() => ({
    name: 'Blog',
    filePathPattern: '*.mdx',
    contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    tags: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    summary: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    published: {
      type: 'boolean',
      description: 'if the post is available',
      required: true,
    }
  },
  computedFields: {
    id: {
      type: 'string',
      resolve: (doc) => doc._id.replace(/.mdx$/, ''),
    },
    url: {
      type: 'string',
      resolve: (doc) => `/blog/${doc._raw.flattenedPath}`,
    },
    tagList: {
      type: 'list',
      of: String,
      resolve: (doc) => doc.tags.split(',').map(item => item.trim())
    }
  },
}))

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post],
  mdx: {
    rehypePlugins: [rehypePrism]
  }
})