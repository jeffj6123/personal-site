// import remarkFrontmatter from 'remark-frontmatter';
// import mdx from '@next/mdx';
// import remarkPrism from 'remark-prism';

// const withMDX = mdx({
//   extension: /\.mdx?$/,
//   options: {
//     remarkPlugins: [remarkPrism,remarkFrontmatter],
//     rehypePlugins: [],
//     // If you use `MDXProvider`, uncomment the following line.
//     // providerImportSource: "@mdx-js/react",
//   },
// })
// export default withMDX({
//   // Append the default value with md extensions
//   pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
// })

const { withContentlayer } = require("next-contentlayer");

module.exports = withContentlayer({});