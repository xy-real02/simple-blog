"use client";

import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { usePostCard } from "./postCard.hooks";
import type { PostSelect } from "@/lib/entities/posts.type";

interface PostCardProps {
    post: PostSelect;
    redirectTo?: string;
}

export const PostCard = ({ post, redirectTo = "/posts" }: PostCardProps) => {
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

    return (
        <div className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-6 shadow-bloom transition-all hover:shadow-md">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-on-surface mb-2">{post.title}</h2>
                <p className="text-sm text-on-surface-muted whitespace-pre-wrap">{post.content}</p>
            </div>
            <div className="flex justify-end gap-2">
                <Button onClick={() => setIsEditing(true)} variant="secondary">
                    Edit
                </Button>
                <Button onClick={() => handleDelete(post.id)} variant="danger">
                    Delete
                </Button>
            </div>
        </div>
    );
};
