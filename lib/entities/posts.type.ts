import { post } from "@/database/schema";
import { UserSelect } from "./users.type";

export type PostSelect = typeof post.$inferSelect;
export type PostInsert = typeof post.$inferInsert;

export type PostResult<T = void> =
    | { ok: true; data: T }
    | { ok: false; error: string };

export type PostWithAuthor = PostSelect & {
    author: Pick<UserSelect, "id" | "name" | "email" | "image">;
};

export type CreatePostInput = {
    title: string;
    content: string;
};
export type UpdatePostInput = {
    id: string;
    title?: string;
    content?: string;
};
export type DeletePostInput = {
    id: string;
};
