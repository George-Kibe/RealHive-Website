import Link from "next/link";
import BlogImage from "@/components/blog/BlogImage";
import { formatPostDate } from "@/components/blog/formatPostDate";

const PostCard = ({ post, priority = false }) => (
  <article className="group flex flex-col overflow-hidden rounded-lg ring-1 ring-border transition-shadow hover:shadow-lg">
    <Link href={`/blog/${post.slug}`} className="flex flex-1 flex-col">
      {post.coverImage ? (
        <BlogImage
          publicId={post.coverImage.publicId}
          alt={post.coverImage.alt}
          width={800}
          height={450}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div aria-hidden="true" className="aspect-video w-full bg-muted" />
      )}
      <div className="flex flex-1 flex-col p-5">
        {post.tags.length > 0 && (
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">{post.tags.slice(0, 3).join(" · ")}</p>
        )}
        <h2 className="mt-2 text-lg font-semibold leading-snug group-hover:underline">{post.title}</h2>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>}
        <p className="mt-auto pt-4 text-xs text-muted-foreground">
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
        </p>
      </div>
    </Link>
  </article>
);

export default PostCard;
