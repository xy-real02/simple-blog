import type { LabelInputField } from "@/components/molecules/LabelInput/labelInput.hooks";

type CreatePostFormParams = {
    error?: string;
    redirectTo?: string;
};

const createPostFields: LabelInputField[] = [
    {
        label: "Post Title",
        name: "title",
        type: "text",
        required: true,
        placeholder: "My awesome blog post...",
    },
    {
        label: "Content",
        name: "content",
        type: "text",
        required: true,
        placeholder: "Write your thoughts here...",
    },
];

export function getCreatePostFormState(params: CreatePostFormParams) {
    return {
        redirectTo: params.redirectTo || "/posts",
        error: params.error,
        fields: createPostFields,
    };
}
