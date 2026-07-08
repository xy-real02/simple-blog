import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getPostsAction } from "@/lib/domain/actions/posts.actions";
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
                <a
                    href="/"
                    className="rounded-xl bg-surface-container px-4 py-2 text-sm font-medium hover:bg-surface-container-high transition-colors"
                >
                    ← Back to Home
                </a>
            </div>
            <div className="rounded-3xl bg-surface-container-low p-8 h-64 animate-pulse" />
        </main>
    );
}

async function PostsContent({ searchParams }: PostsPageProps) {
    const params = await searchParams;
    const result = await getPostsAction();

    if (!result.ok) {
        redirect(`/sign-in?callbackURL=/posts&error=${encodeURIComponent(result.error)}`);
    }

    return (
        <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-on-surface">Blog Posts</h1>
                    <p className="text-sm text-on-surface-muted mt-1">
                        Manage blog posts with role-based access control.
                    </p>
                </div>
                <a
                    href="/"
                    className="rounded-xl bg-surface-container px-4 py-2 text-sm font-medium hover:bg-surface-container-high transition-colors"
                >
                    ← Back to Home
                </a>
            </div>

            <CreatePostForm searchParams={params} />

            <section>
                <h2 className="text-2xl font-bold text-on-surface mb-6">
                    Recent Posts ({result.data.length})
                </h2>
                <PostsTable posts={result.data} redirectTo="/posts" error={params.error} />
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
