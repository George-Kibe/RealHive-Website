"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { buttonVariants } from "@/components/ui/button";
import { formatPostDate } from "@/components/blog/formatPostDate";

const MAX_LENGTH = 2000;

/**
 * Comment thread for a post. Loaded on the client so the post page itself can
 * stay statically rendered. Anyone can read; only signed-in users can post.
 */
const Comments = ({ postId, postPath }) => {
  const [comments, setComments] = useState(null);
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    axios.get(`/api/posts/${postId}/comments`)
      .then((res) => setComments(res.data.comments))
      .catch(() => setLoadError(true));
    axios.get("/api/auth/session")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, [postId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setPosting(true);
    setError("");
    try {
      const res = await axios.post(`/api/posts/${postId}/comments`, { body });
      setComments((prev) => [...(prev ?? []), res.data.comment]);
      setBody("");
    } catch (err) {
      if (err.response?.status === 401) setUser(null);
      setError(typeof err.response?.data === "string" && err.response.data ? err.response.data : "Couldn't post your comment. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const remove = async (comment) => {
    if (!window.confirm("Delete your comment?")) return;
    try {
      await axios.delete(`/api/comments/${comment._id}`);
      setComments((prev) => prev.filter((c) => c._id !== comment._id));
    } catch {
      setError("Couldn't delete the comment. Please try again.");
    }
  };

  const signOut = async () => {
    await axios.delete("/api/auth/session").catch(() => {});
    setUser(null);
  };

  const loginHref = `/login?next=${encodeURIComponent(postPath + "#comments")}`;

  return (
    <section id="comments" aria-labelledby="comments-heading" className="mt-16 border-t border-border pt-10">
      <h2 id="comments-heading" className="text-2xl font-bold tracking-tight">
        Comments{comments?.length ? ` (${comments.length})` : ""}
      </h2>

      {loadError && <p className="mt-4 text-sm text-muted-foreground">Comments couldn&apos;t be loaded right now.</p>}
      {comments === null && !loadError && <p className="mt-4 text-sm text-muted-foreground">Loading comments…</p>}
      {comments?.length === 0 && <p className="mt-4 text-sm text-muted-foreground">No comments yet. Start the conversation.</p>}

      {comments?.length > 0 && (
        <ul className="mt-6 space-y-6">
          {comments.map((comment) => (
            <li key={comment._id} className="rounded-lg p-4 ring-1 ring-border">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <p>
                  <span className="font-semibold">{comment.user?.username ?? "Deleted user"}</span>
                  <span className="text-muted-foreground"> · <time dateTime={comment.createdAt}>{formatPostDate(comment.createdAt)}</time></span>
                </p>
                {user && comment.user?._id === user._id && (
                  <button type="button" onClick={() => remove(comment)} className="text-xs text-muted-foreground hover:text-destructive">
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-2 whitespace-pre-line break-words text-sm leading-6">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        {user === undefined ? null : user ? (
          <form onSubmit={submit}>
            <label htmlFor="comment-body" className="block text-sm font-medium">
              Comment as <span className="font-semibold">{user.username}</span>
              <button type="button" onClick={signOut} className="ml-2 text-xs font-normal text-muted-foreground underline">
                Sign out
              </button>
            </label>
            <textarea
              id="comment-body"
              rows={4}
              maxLength={MAX_LENGTH}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-2 w-full rounded-md border-0 bg-muted px-3.5 py-2 text-foreground shadow-xs ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
              placeholder="Share your thoughts…"
            />
            <div className="mt-2 flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">{body.length}/{MAX_LENGTH}</p>
              <button type="submit" disabled={posting || !body.trim()} className={buttonVariants({ variant: "brand" })}>
                {posting ? "Posting…" : "Post comment"}
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-lg p-4 text-sm ring-1 ring-border">
            <Link href={loginHref} className="font-semibold text-brand hover:underline">Sign in</Link>
            {" "}or{" "}
            <Link href={`/register?next=${encodeURIComponent(postPath + "#comments")}`} className="font-semibold text-brand hover:underline">create an account</Link>
            {" "}to join the conversation.
          </div>
        )}
        {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
    </section>
  );
};

export default Comments;
