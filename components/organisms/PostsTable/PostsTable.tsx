"use client";

import type { PostSelect, PostWithAuthor } from "@/lib/entities/posts.type";
import { PostCard } from "@/components/molecules/PostCard/PostCard";
import { usePostsTable } from "./postsTable.hooks";

interface PostsTableProps {
    posts: (PostSelect | PostWithAuthor)[];
    redirectTo?: string;
    error?: string;
    canManage?: boolean;
}

export const PostsTable = ({ posts, redirectTo = "/posts", error, canManage = true }: PostsTableProps) => {
    const { postsData } = usePostsTable({ posts });

    return (
        <div>
            {error ? (
                <p className="mb-6 rounded-xl bg-secondary-container px-4 py-3 text-sm text-secondary">
                    {error}
                </p>
            ) : null}

            {postsData.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-outline-variant p-12 text-center">
                    <p className="text-on-surface-muted">No blog posts yet. Create the first one above!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {postsData.map((post) => (
                        <PostCard key={post.id} post={post} redirectTo={redirectTo} canManage={canManage} />
                    ))}
                </div>
            )}
        </div>
    );
};
