import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PROSE_CLASSES } from "@/components/blog/proseClasses";

/**
 * Renders post Markdown (GitHub-flavoured: tables, task lists, strikethrough).
 * Raw HTML in the Markdown is not rendered, so post content can't inject
 * scripts. External links open in a new tab.
 */
const components = {
  // eslint-disable-next-line @next/next/no-img-element -- Cloudinary URLs already carry f_auto/q_auto/width transformations
  img: ({ node: _node, src, alt = "", ...props }) => <img src={src} alt={alt} loading="lazy" decoding="async" {...props} />,
  a: ({ node: _node, href = "", children, ...props }) => {
    const external = /^https?:\/\//i.test(href);
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props}>
        {children}
      </a>
    );
  },
};

const Markdown = ({ children, className = "" }) => (
  <div className={`${PROSE_CLASSES} ${className}`}>
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  </div>
);

export default Markdown;
