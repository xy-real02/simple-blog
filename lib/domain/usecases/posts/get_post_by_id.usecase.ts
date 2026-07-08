import { eq } from "drizzle-orm";
import { database } from "@/database";
import { post, user } from "@/database/schema";
import type { PostWithAuthor } from "@/lib/entities/posts.type";

export async function getPostById(id: string): Promise<PostWithAuthor | null> {
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
            .where(eq(post.id, id))
            .limit(1);

        const foundPost = rows[0];

        if (foundPost) {
            return {
                id: foundPost.id,
                title: foundPost.title,
                content: foundPost.content,
                createdAt: foundPost.createdAt,
                updatedAt: foundPost.updatedAt,
                authorId: foundPost.authorId,
                author: {
                    id: foundPost.author?.id ?? foundPost.authorId,
                    name: foundPost.author?.name ?? "Anonymous Author",
                    email: foundPost.author?.email ?? "unknown@example.com",
                    image: foundPost.author?.image ?? null,
                },
            };
        }

        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}
