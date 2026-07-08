"use client";

import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { usePostCard } from "./postCard.hooks";
import type { PostSelect, PostWithAuthor } from "@/lib/entities/posts.type";

interface PostCardProps {
    post: PostSelect | PostWithAuthor;
    redirectTo?: string;
    canManage?: boolean;
}

export const PostCard = ({ post, redirectTo = "/posts", canManage = true }: PostCardProps) => {
    const { isEditing, setIsEditing, handleDelete, handleUpdate } = usePostCard(redirectTo);

    if (isEditing) {
        return (
            <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-bloom">
                <form action={handleUpdate} className="space-y-4">
                    <input type="hidden" name="id" value={post.id} />
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-muted mb-1">
                            Title
                        </label>
                        <Input name="title" defaultValue={post.title} required className="w-full" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-muted mb-1">
                            Content
                        </label>
                        <Input name="content" defaultValue={post.content} required className="w-full" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    const author = "author" in post ? post.author : null;

    return (
        <div className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-6 shadow-bloom transition-all hover:shadow-md">
            <div className="mb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        {author ? (
                            <>
                                {author.image ? (
                                    <img
                                        src={author.image}
                                        alt={author.name}
                                        className="h-6 w-6 rounded-full object-cover border border-outline-variant/30"
                                    />
                                ) : (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-on-primary-container">
                                        {author.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="text-xs font-medium text-on-surface-variant">
                                    By <strong className="text-on-surface">{author.name}</strong>
                                </span>
                            </>
                        ) : (
                            <span className="text-xs font-medium text-on-surface-muted">
                                By <strong className="text-on-surface">Author #{post.authorId.slice(0, 8)}</strong>
                            </span>
                        )}
                    </div>
                    {post.createdAt ? (
                        <time
                            dateTime={new Date(post.createdAt).toISOString()}
                            suppressHydrationWarning
                            className="text-xs text-on-surface-muted/80"
                        >
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}{" "}
                            at{" "}
                            {new Date(post.createdAt).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                            })}
                        </time>
                    ) : null}
                </div>
                <h2 className="text-xl font-bold text-on-surface mb-2">{post.title}</h2>
                <p className="text-sm text-on-surface-muted whitespace-pre-wrap">{post.content}</p>
            </div>
            {canManage ? (
                <div className="flex justify-end gap-2">
                    <Button onClick={() => setIsEditing(true)} variant="secondary">
                        Edit
                    </Button>
                    <Button onClick={() => handleDelete(post.id)} variant="danger">
                        Delete
                    </Button>
                </div>
            ) : null}
        </div>
    );
};
