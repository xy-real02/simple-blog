import { createPostAction } from "@/lib/domain/actions/posts.actions";
import { LabelInput } from "@/components/molecules/LabelInput/LabelInput";
import { Button } from "@/components/atoms/Button/Button";
import { getCreatePostFormState } from "./createPostForm.hooks";
import { useAuthFormSubmitStyles } from "@/components/atoms/Button/button.hooks";

type CreatePostFormProps = {
    searchParams?: { error?: string; redirectTo?: string };
};

export function CreatePostForm({ searchParams = {} }: CreatePostFormProps) {
    const { redirectTo, error, fields } = getCreatePostFormState(searchParams);
    const submitClassName = useAuthFormSubmitStyles();

    return (
        <div className="rounded-3xl bg-surface-container-low p-8 shadow-bloom">
            <h2 className="mb-2 text-2xl font-bold text-on-surface">Create New Post</h2>
            <p className="mb-6 text-sm text-on-surface-muted">
                Only admins can write or delete posts. Developers have read-only access.
            </p>

            {error ? (
                <p className="mb-6 rounded-xl bg-secondary-container px-4 py-3 text-sm text-secondary">
                    {error}
                </p>
            ) : null}

            <form action={createPostAction} className="space-y-5">
                <input type="hidden" name="redirectTo" value={redirectTo} />

                {fields.map((field) => (
                    <LabelInput key={field.name} {...field} />
                ))}

                <Button type="submit" className={submitClassName}>
                    Publish Post
                </Button>
            </form>
        </div>
    );
}
