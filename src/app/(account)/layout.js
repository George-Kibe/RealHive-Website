/**
 * Sign-in, registration and password-reset pages for website users (blog
 * commenters). Utility pages: kept out of search results and the sitemap.
 */
export const metadata = {
  robots: { index: false, follow: true },
};

export default function AccountLayout({ children }) {
  return <div className="mx-auto max-w-sm px-4 py-10 sm:py-16">{children}</div>;
}
