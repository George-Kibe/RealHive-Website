"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { buttonVariants } from "@/components/ui/button";
import { formatPostDate } from "@/components/blog/formatPostDate";

// Comment moderation for one post: admins can delete any comment.
const AdminComments = ({ comments }) => {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const remove = async (comment) => {
    if (!window.confirm("Delete this comment? This can't be undone.")) return;
    setBusyId(comment._id);
    setError("");
    try {
      await axios.delete(`/api/comments/${comment._id}`);
      router.refresh();
    } catch {
      setError("Couldn't delete the comment. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-lg font-semibold">Comments ({comments.length})</h2>
      {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
      {comments.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No comments on this post yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {comments.map((comment) => (
            <li key={comment._id} className="rounded-lg p-4 ring-1 ring-border">
              <div className="flex flex-wrap items-start justify-between gap-2 text-sm">
                <p>
                  <span className="font-semibold">{comment.user?.username ?? "Deleted user"}</span>
                  {comment.user?.email && <span className="text-muted-foreground"> ({comment.user.email})</span>}
                  <span className="text-muted-foreground"> · {formatPostDate(comment.createdAt)}</span>
                </p>
                <button type="button" disabled={busyId === comment._id} onClick={() => remove(comment)}
                  className={buttonVariants({ variant: "destructive", size: "sm" })}>
                  Delete
                </button>
              </div>
              <p className="mt-2 whitespace-pre-line break-words text-sm leading-6">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AdminComments;
