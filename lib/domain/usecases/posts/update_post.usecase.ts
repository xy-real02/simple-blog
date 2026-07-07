import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { database } from "@/database";
import { post } from "@/database/schema";
import type { PostResult, UpdatePostInput } from "@/lib/entities/posts.type";

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return "Failed to update post.";
}

export async function updatePost(input: UpdatePostInput): Promise<PostResult> {
    try {
        await database
            .update(post)
            .set({
                ...(input.title ? { title: input.title } : {}),
                ...(input.content ? { content: input.content } : {}),
            })
            .where(eq(post.id, input.id));

        updateTag("posts");

        return { ok: true, data: undefined };
    } catch (error) {
        console.error(error);
        return { ok: false, error: getErrorMessage(error) };
    }
}
