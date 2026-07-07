import { deletePostAction } from "@/lib/domain/actions/posts.actions";

export const usePostCard = (redirectTo = "/posts") => {
    const handleDelete = async (id: string) => {
        const formData = new FormData();
        formData.set("id", id);
        formData.set("redirectTo", redirectTo);
        await deletePostAction(formData);
    };

    return {
        handleDelete,
    };
};
