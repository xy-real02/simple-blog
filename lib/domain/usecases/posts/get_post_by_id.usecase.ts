import { eq } from "drizzle-orm";
import { database } from "@/database";
import { post } from "@/database/schema";
import type { PostSelect } from "@/lib/entities/posts.type";

export async function getPostById(id: string): Promise<PostSelect | null> {
    try {
        const rows = await database
            .select()
            .from(post)
            .where(eq(post.id, id))
            .limit(1);

        const foundPost = rows[0];

        if (foundPost) {
            return foundPost;
        }

        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}
