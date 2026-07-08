import { Suspense } from "react";
import Link from "next/link";
import { getPostsAction } from "@/lib/domain/actions/posts.actions";
import { getSessionAction } from "@/lib/domain/actions/auth.actions";
import { PostsTable } from "@/components/organisms/PostsTable/PostsTable";
import { CreatePostForm } from "@/components/organisms/CreatePostForm/CreatePostForm";

type PostsPageProps = {
    searchParams: Promise<{ error?: string }>;
};

function PostsFallback() {
    return (
        <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-on-surface">Blog Posts</h1>
                    <p className="text-sm text-on-surface-muted mt-1">Loading posts...</p>
                </div>
                <Link
                    href="/"
                    className="rounded-xl bg-surface-container px-4 py-2 text-sm font-medium hover:bg-surface-container-high transition-colors"
                >
                    ← Back to Home
                </Link>
            </div>
            <div className="rounded-3xl bg-surface-container-low p-8 h-64 animate-pulse" />
        </main>
    );
}

async function PostsContent({ searchParams }: PostsPageProps) {
    const params = await searchParams;
    const [result, userSession] = await Promise.all([getPostsAction(), getSessionAction()]);
    const isAdmin = userSession?.user?.role === "admin";

    return (
        <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-on-surface">Blog Posts</h1>
                    <p className="text-sm text-on-surface-muted mt-1">
                        Read recent articles or sign in as an admin to manage publications.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {userSession ? (
                        <span className="text-xs text-on-surface-muted bg-surface-container px-3 py-1.5 rounded-lg">
                            Role: <strong className="text-on-surface uppercase">{userSession.user.role || "dev"}</strong>
                        </span>
                    ) : (
                        <Link
                            href="/sign-in?callbackURL=/posts"
                            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90 transition-opacity"
                        >
                            Sign In
                        </Link>
                    )}
                    <Link
                        href="/"
                        className="rounded-xl bg-surface-container px-4 py-2 text-sm font-medium hover:bg-surface-container-high transition-colors"
                    >
                        ← Home
                    </Link>
                </div>
            </div>

            {!result.ok ? (
                <div className="rounded-2xl bg-secondary-container p-6 text-secondary">
                    <p className="font-semibold">Unable to load posts</p>
                    <p className="text-sm mt-1">{result.error}</p>
                </div>
            ) : null}

            {isAdmin ? (
                <CreatePostForm searchParams={params} />
            ) : (
                <div className="rounded-2xl bg-surface-container-lowest p-6 border border-outline/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-bloom">
                    <div>
                        <h3 className="font-semibold text-on-surface">Want to write or manage articles?</h3>
                        <p className="text-sm text-on-surface-muted mt-0.5">
                            {userSession
                                ? "Your account currently has read-only access (dev role). An admin account is required to create, update, or delete posts."
                                : "You are viewing as a guest. Sign in with an admin account to publish and edit articles."}
                        </p>
                    </div>
                    {!userSession ? (
                        <Link
                            href="/sign-in?callbackURL=/posts"
                            className="shrink-0 rounded-xl bg-surface-container-high px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container-highest transition-colors"
                        >
                            Sign In Now
                        </Link>
                    ) : null}
                </div>
            )}

            <section>
                <h2 className="text-2xl font-bold text-on-surface mb-6">
                    Recent Posts ({result.ok ? result.data.length : 0})
                </h2>
                {result.ok ? (
                    <PostsTable posts={result.data} redirectTo="/posts" error={params.error} canManage={isAdmin} />
                ) : null}
            </section>
        </main>
    );
}

export default function PostsPage({ searchParams }: PostsPageProps) {
    return (
        <Suspense fallback={<PostsFallback />}>
            <PostsContent searchParams={searchParams} />
        </Suspense>
    );
}
