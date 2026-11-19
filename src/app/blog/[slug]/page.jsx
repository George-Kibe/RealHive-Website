import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCldOgImageUrl } from 'next-cloudinary'
import BlogImage from '@/components/blog/BlogImage'
import Comments from '@/components/blog/Comments'
import Markdown from '@/components/blog/Markdown'
import { formatPostDate } from '@/components/blog/formatPostDate'
import JsonLd from '@/components/JsonLd'
import { getPublishedPostBySlug, getPublishedPosts, readingMinutes } from '@/lib/blog'
import { serviceForTags, servicePath } from '@/constants/servicePages'
import { TEAM_BY_SLUG, memberPath } from '@/constants/team'
import Image from 'next/image'
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
  // every post links to the service it relates to (SEO plan 2.7)
  const service = serviceForTags(post.tags)
  // the named author (SEO plan 3.6); without one the post is the company's
  const author = TEAM_BY_SLUG[post.authorSlug] ?? null

  return (
    <article className='max-container padding-container page-y'>
      <JsonLd schema={blogPostingSchema(post, { imageUrl: socialImageUrl(post), author })} />
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
          {' · '}By{' '}
          {author
            ? <Link href={memberPath(author.slug)} rel='author' className='font-medium text-foreground hover:text-brand hover:underline'>{author.name}</Link>
            : 'RealHive Consultants'}
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
        {author && (
          <aside aria-label='About the author' className='mt-12 flex gap-5 border-t border-border pt-8'>
            <Image src={author.image} alt='' width={72} quality={60} className='h-18 w-18 shrink-0 rounded-full bg-muted object-cover object-top ring-1 ring-border' />
            <div>
              <p className='text-sm text-muted-foreground'>Written by</p>
              <p className='text-lg font-semibold'>
                <Link href={memberPath(author.slug)} rel='author' className='hover:text-brand hover:underline'>{author.name}</Link>
              </p>
              <p className='text-sm text-muted-foreground'>{author.role} at RealHive Consultants</p>
              {author.bio && <p className='mt-3 text-muted-foreground'>{author.bio}</p>}
              {author.links.length > 0 && (
                <p className='mt-3 flex flex-wrap gap-x-4 text-sm'>
                  {author.links.map((link) => (
                    <a key={link.href} href={link.href} target='_blank' rel='noopener noreferrer' className='font-medium text-brand hover:underline'>{link.name}</a>
                  ))}
                </p>
              )}
            </div>
          </aside>
        )}
        {service && (
          <aside aria-label='Related service' className='mt-12 rounded-2xl bg-muted p-6 ring-1 ring-border sm:p-8'>
            <p className='text-sm font-semibold text-brand'>Need help with this?</p>
            <p className='mt-2 text-xl font-semibold'>{service.name} at RealHive Consultants</p>
            <p className='mt-2 text-muted-foreground'>{service.metaDescription}</p>
            <Link href={servicePath(service.slug)} className='mt-4 inline-block font-medium text-brand hover:underline'>
              Explore our {service.name.toLowerCase()} services <span aria-hidden='true'>&rarr;</span>
            </Link>
          </aside>
        )}
        <Comments postId={post._id} postPath={`/blog/${post.slug}`} />
      </div>
    </article>
  )
}

export default BlogPostPage
