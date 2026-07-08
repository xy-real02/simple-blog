import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { database } from "@/database";
import { post } from "@/database/schema";
import type { DeletePostInput, PostResult } from "@/lib/entities/posts.type";

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return "Failed to delete post.";
}

export async function deletePost(input: DeletePostInput): Promise<PostResult> {
    try {
        await database
            .delete(post)
            .where(eq(post.id, input.id));

        updateTag("posts");
        updateTag(`post:${input.id}`);

        return { ok: true, data: undefined };
    } catch (error) {
        console.error(error);
        return { ok: false, error: getErrorMessage(error) };
    }
}
