import AnimatedText from '@/components/AnimatedText'
import PostCard from '@/components/blog/PostCard'
import { getPublishedPosts } from '@/lib/blog'
import { buildMetadata } from '@/lib/seo'

// Admin edits revalidate this page immediately; the hourly fallback covers a missed revalidation.
export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Blog: AI, Tech & Programming',
  description:
    'Practical articles on AI, software engineering and programming from the RealHive Consultants team: what we build, what we learn and what works in production.',
  path: '/blog',
})

const BlogPage = async () => {
  const posts = await getPublishedPosts()

  return (
    <div className='padding-container max-container pb-24'>
      <AnimatedText text={"Blog"}/>
      <p className='mx-auto -mt-4 max-w-2xl text-center text-lg text-muted-foreground'>
        AI, tech and programming notes from the RealHive team.
      </p>
      {posts.length === 0 ? (
        <p className='mt-16 text-center text-muted-foreground'>No posts yet. Check back soon.</p>
      ) : (
        <div className='mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {posts.map((post, i) => (
            <PostCard key={post._id} post={post} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  )
}

export default BlogPage
