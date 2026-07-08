"use server";

/**
 * AAA action template — copy this pattern into every protected action.
 *
 * try {
 *   const userSession = await auth();                         // Authentication
 *   if (!userSession || userSession.expired) { log + error }
 *
 *   if (!hasPermission(userSession.user.role, PERMISSION)) {  // Authorization
 *     log + error
 *   }
 *
 *   const data = await someService();
 *
 *   await logAction({ ... });                                 // Accounting
 *   return { ok: true, data };
 * } catch (error) {
 *   await logAction({ ... });
 *   return { ok: false, error: message };
 * }
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/domain/services/auth.service";
import {
    createPost,
    deletePost,
    getPostById,
    getPosts,
    updatePost,
} from "@/lib/domain/services/posts.service";
import { logAction } from "@/lib/domain/usecases/auth/log_action.usecase";
import {
    hasPermission,
    USER_PERMISSION,
} from "@/lib/entities/users.type";
import type {
    PostResult,
    PostSelect,
} from "@/lib/entities/posts.type";




function readField(formData: FormData, name: string): string {
    return String(formData.get(name) ?? "").trim();
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return "Unexpected error.";
}

/** Read action — list all blog posts. */
export async function getPostsAction(): Promise<PostResult<PostSelect[]>> {
    const action = "posts:list";
    const permission = USER_PERMISSION.POSTS_READ;

    try {
        // 1. Authentication (Optional for read-only blog listing)
        const userSession = await auth();

        // 2. Authorization (If user is signed in, check their role permission; if anonymous, allow read)
        if (userSession && !hasPermission(userSession.user.role, permission)) {
            await logAction({
                userId: userSession.user.id,
                action,
                success: false,
                error: "Not authorized.",
                role: userSession.user.role,
            });
            return { ok: false, error: "You are not authorized for this action." };
        }

        const posts = await getPosts();

        // 3. Accounting
        await logAction({
            userId: userSession?.user?.id ?? "anonymous",
            action,
            success: true,
            role: userSession?.user?.role,
        });

        return { ok: true, data: posts };
    } catch (error) {
        const message = getErrorMessage(error);
        await logAction({ userId: "unknown", action, success: false, error: message });
        return { ok: false, error: message };
    }
}

/** Read action — get single post by ID. */
export async function getPostByIdAction(id: string): Promise<PostResult<PostSelect | null>> {
    const action = "posts:get";
    const permission = USER_PERMISSION.POSTS_READ;

    try {
        const userSession = await auth();

        if (userSession && !hasPermission(userSession.user.role, permission)) {
            await logAction({
                userId: userSession.user.id,
                action,
                success: false,
                error: "Not authorized.",
                role: userSession.user.role,
                metadata: { targetPostId: id },
            });
            return { ok: false, error: "You are not authorized for this action." };
        }

        const post = await getPostById(id);

        await logAction({
            userId: userSession?.user?.id ?? "anonymous",
            action,
            success: true,
            role: userSession?.user?.role,
            metadata: { targetPostId: id },
        });

        return { ok: true, data: post };
    } catch (error) {
        const message = getErrorMessage(error);
        await logAction({
            userId: "unknown",
            action,
            success: false,
            error: message,
            metadata: { targetPostId: id },
        });
        return { ok: false, error: message };
    }
}

/** Write action — create a new post (redirects on outcome). */
export async function createPostAction(formData: FormData) {
    const action = "posts:create";
    const permission = USER_PERMISSION.POSTS_CREATE;
    const title = readField(formData, "title");
    const content = readField(formData, "content");
    const redirectTo = readField(formData, "redirectTo") || "/posts";

    if (!title || !content) {
        redirect(`${redirectTo}?error=${encodeURIComponent("Title and content are required")}`);
    }

    try {
        const userSession = await auth();
        if (!userSession || userSession.expired) {
            await logAction({
                userId: "anonymous",
                action,
                success: false,
                error: "Authentication required.",
            });
            redirect(`${redirectTo}?error=${encodeURIComponent("Authentication required.")}`);
        }

        if (!hasPermission(userSession.user.role, permission)) {
            await logAction({
                userId: userSession.user.id,
                action,
                success: false,
                error: "Not authorized.",
                role: userSession.user.role,
            });
            redirect(`${redirectTo}?error=${encodeURIComponent("You are not authorized to create posts.")}`);
        }

        // Securely use the authenticated user's ID as the author!
        const result = await createPost({ title, content }, userSession.user.id);

        await logAction({
            userId: userSession.user.id,
            action,
            success: result.ok,
            role: userSession.user.role,
            error: result.ok ? undefined : result.error,
        });

        if (!result.ok) {
            redirect(`${redirectTo}?error=${encodeURIComponent(result.error)}`);
        }

        redirect(redirectTo);
    } catch (error) {
        const message = getErrorMessage(error);
        await logAction({ userId: "unknown", action, success: false, error: message });
        redirect(`${redirectTo}?error=${encodeURIComponent(message)}`);
    }
}

/** Write action — update an existing post. */
export async function updatePostAction(formData: FormData) {
    const action = "posts:update";
    const permission = USER_PERMISSION.POSTS_UPDATE;
    const id = readField(formData, "id");
    const title = readField(formData, "title");
    const content = readField(formData, "content");
    const redirectTo = readField(formData, "redirectTo") || "/posts";

    if (!id) {
        redirect(`${redirectTo}?error=${encodeURIComponent("Post ID is required")}`);
    }

    try {
        const userSession = await auth();
        if (!userSession || userSession.expired) {
            await logAction({
                userId: "anonymous",
                action,
                success: false,
                error: "Authentication required.",
                metadata: { targetPostId: id },
            });
            redirect(`${redirectTo}?error=${encodeURIComponent("Authentication required.")}`);
        }

        if (!hasPermission(userSession.user.role, permission)) {
            await logAction({
                userId: userSession.user.id,
                action,
                success: false,
                error: "Not authorized.",
                role: userSession.user.role,
                metadata: { targetPostId: id },
            });
            redirect(`${redirectTo}?error=${encodeURIComponent("You are not authorized to update posts.")}`);
        }

        const result = await updatePost({
            id,
            ...(title ? { title } : {}),
            ...(content ? { content } : {}),
        });

        await logAction({
            userId: userSession.user.id,
            action,
            success: result.ok,
            role: userSession.user.role,
            error: result.ok ? undefined : result.error,
            metadata: { targetPostId: id },
        });

        if (!result.ok) {
            redirect(`${redirectTo}?error=${encodeURIComponent(result.error)}`);
        }

        redirect(redirectTo);
    } catch (error) {
        const message = getErrorMessage(error);
        await logAction({
            userId: "unknown",
            action,
            success: false,
            error: message,
            metadata: { targetPostId: id },
        });
        redirect(`${redirectTo}?error=${encodeURIComponent(message)}`);
    }
}

/** Write action — delete a post. */
export async function deletePostAction(formData: FormData) {
    const action = "posts:delete";
    const permission = USER_PERMISSION.POSTS_DELETE;
    const id = readField(formData, "id");
    const redirectTo = readField(formData, "redirectTo") || "/posts";

    if (!id) {
        redirect(`${redirectTo}?error=${encodeURIComponent("Post ID is required")}`);
    }

    try {
        const userSession = await auth();
        if (!userSession || userSession.expired) {
            await logAction({
                userId: "anonymous",
                action,
                success: false,
                error: "Authentication required.",
                metadata: { targetPostId: id },
            });
            redirect(`${redirectTo}?error=${encodeURIComponent("Authentication required.")}`);
        }

        if (!hasPermission(userSession.user.role, permission)) {
            await logAction({
                userId: userSession.user.id,
                action,
                success: false,
                error: "Not authorized.",
                role: userSession.user.role,
                metadata: { targetPostId: id },
            });
            redirect(`${redirectTo}?error=${encodeURIComponent("You are not authorized to delete posts.")}`);
        }

        const result = await deletePost({ id });

        await logAction({
            userId: userSession.user.id,
            action,
            success: result.ok,
            role: userSession.user.role,
            error: result.ok ? undefined : result.error,
            metadata: { targetPostId: id },
        });

        if (!result.ok) {
            redirect(`${redirectTo}?error=${encodeURIComponent(result.error)}`);
        }

        redirect(redirectTo);
    } catch (error) {
        const message = getErrorMessage(error);
        await logAction({
            userId: "unknown",
            action,
            success: false,
            error: message,
            metadata: { targetPostId: id },
        });
        redirect(`${redirectTo}?error=${encodeURIComponent(message)}`);
    }
}
