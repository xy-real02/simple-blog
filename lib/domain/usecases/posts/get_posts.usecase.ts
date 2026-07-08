import { cacheLife, cacheTag } from "next/cache";
import { eq, desc } from "drizzle-orm";
import { database } from "@/database";
import { post, user } from "@/database/schema";
import type { PostWithAuthor } from "@/lib/entities/posts.type";

export async function getPosts(): Promise<PostWithAuthor[]> {
    "use cache";
    cacheLife("hours");
    cacheTag("posts");

    try {
        const rows = await database
            .select({
                id: post.id,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                authorId: post.authorId,
                author: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                },
            })
            .from(post)
            .leftJoin(user, eq(post.authorId, user.id))
            .orderBy(desc(post.createdAt));

        return rows.map((r) => ({
            id: r.id,
            title: r.title,
            content: r.content,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            authorId: r.authorId,
            author: {
                id: r.author?.id ?? r.authorId,
                name: r.author?.name ?? "Anonymous Author",
                email: r.author?.email ?? "unknown@example.com",
                image: r.author?.image ?? null,
            },
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}
