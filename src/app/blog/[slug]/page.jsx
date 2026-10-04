import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCldOgImageUrl } from 'next-cloudinary'
import BlogImage from '@/components/blog/BlogImage'
import Comments from '@/components/blog/Comments'
import Markdown from '@/components/blog/Markdown'
import { formatPostDate } from '@/components/blog/formatPostDate'
import JsonLd from '@/components/JsonLd'
import { getPublishedPostBySlug, getPublishedPosts, readingMinutes } from '@/lib/blog'
import { blogPostingSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

// Admin edits revalidate the post immediately; the hourly fallback covers a missed revalidation.
export const revalidate = 3600

// Pre-render the published posts at build; new slugs render on first request.
export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

/**
 * Social card built with Cloudinary transformations: the cover cropped to
 * 1200x630 around its focal point, darkened, with the post title overlaid.
 */
const socialImageUrl = (post) =>
  post.coverImage
    ? getCldOgImageUrl({
        src: post.coverImage.publicId,
        effects: [{ brightness: -45 }],
        overlays: [
          {
            width: 1040,
            crop: 'fit',
            position: { x: 80, y: 80, gravity: 'north_west' },
            text: { color: 'white', fontFamily: 'Source Sans Pro', fontSize: 64, fontWeight: 'bold', text: post.title },
          },
          {
            position: { x: 80, y: 70, gravity: 'south_west' },
            text: { color: 'rgb:00BAFF', fontFamily: 'Source Sans Pro', fontSize: 36, fontWeight: 'bold', text: 'RealHive Consultants' },
          },
        ],
      })
    : undefined

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)
  if (!post) return { title: 'Post not found', robots: { index: false } }
  return buildMetadata({
    title: post.title,
    description: post.excerpt || post.title,
    path: `/blog/${post.slug}`,
    type: 'article',
    image: socialImageUrl(post),
  })
}

const BlogPostPage = async ({ params }) => {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)
  // The root loading.jsx streams every page, so this renders not-found.js with
  // a 200 status and a noindex tag (Next's soft 404), not an HTTP 404.
  if (!post) notFound()

  return (
    <article className='max-container padding-container page-y'>
      <JsonLd schema={blogPostingSchema(post, { imageUrl: socialImageUrl(post) })} />
      <div className='mx-auto max-w-3xl'>
        <Link href='/blog' className='text-sm text-muted-foreground hover:text-foreground'>&larr; All posts</Link>
        {post.tags.length > 0 && (
          <p className='mt-6 text-xs font-semibold uppercase tracking-wide text-brand'>{post.tags.join(' · ')}</p>
        )}
        <h1 className='mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'>{post.title}</h1>
        {post.excerpt && <p className='mt-4 text-lg text-muted-foreground'>{post.excerpt}</p>}
        <p className='mt-4 text-sm text-muted-foreground'>
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          {' · '}{readingMinutes(post.content)} min read
          {post.author && <>{' · '}By {post.author}</>}
        </p>
      </div>

      {post.coverImage && (
        <BlogImage
          publicId={post.coverImage.publicId}
          alt={post.coverImage.alt}
          width={1600}
          height={900}
          sizes='(min-width: 1280px) 1200px, 100vw'
          priority
          className='mx-auto mt-10 aspect-video w-full max-w-5xl rounded-xl object-cover'
        />
      )}

      <div className='mx-auto mt-10 max-w-3xl'>
        <Markdown>{post.content}</Markdown>
        <Comments postId={post._id} postPath={`/blog/${post.slug}`} />
      </div>
    </article>
  )
}

export default BlogPostPage
