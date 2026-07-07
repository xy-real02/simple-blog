import { updateTag } from "next/cache";
import { database } from "@/database";
import { post } from "@/database/schema";
import type { CreatePostInput, PostResult, PostSelect } from "@/lib/entities/posts.type";

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return "Failed to create post.";
}

export async function createPost(
    input: CreatePostInput,
    authorId: string
): Promise<PostResult<PostSelect>> {
    try {
        const newPost = {
            id: crypto.randomUUID(),
            title: input.title,
            content: input.content,
            authorId: authorId,
        };

        await database.insert(post).values(newPost);
        updateTag("posts"); // invalidate cache to show new posts instantly

        return { ok: true, data: newPost as PostSelect };
    } catch (error) {
        console.error(error);
        return { ok: false, error: getErrorMessage(error) };
    }
}
