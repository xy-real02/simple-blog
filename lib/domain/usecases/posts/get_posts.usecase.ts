import { cacheLife, cacheTag } from "next/cache";
import { database } from "@/database";
import { post } from "@/database/schema";
import type { PostSelect } from "@/lib/entities/posts.type";

export async function getPosts(): Promise<PostSelect[]> {
    "use cache";
    cacheLife("hours");
    cacheTag("posts");

    try {
        return await database.select().from(post);
    } catch (error) {
        console.error(error);
        return [];
    }
}
