"use client";

import { Button } from "@/components/atoms/Button/Button";
import { usePostCard } from "./postCard.hooks";
import type { PostSelect } from "@/lib/entities/posts.type";

interface PostCardProps {
    post: PostSelect;
    redirectTo?: string;
}

export const PostCard = ({ post, redirectTo = "/posts" }: PostCardProps) => {
    const { handleDelete } = usePostCard(redirectTo);

    return (
        <div className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-6 shadow-bloom transition-all hover:shadow-md">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-on-surface mb-2">{post.title}</h2>
                <p className="text-sm text-on-surface-muted whitespace-pre-wrap">{post.content}</p>
            </div>
            <div className="flex justify-end">
                <Button onClick={() => handleDelete(post.id)} variant="danger">
                    Delete
                </Button>
            </div>
        </div>
    );
};
