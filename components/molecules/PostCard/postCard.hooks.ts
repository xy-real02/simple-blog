import { useState } from "react";
import { deletePostAction, updatePostAction } from "@/lib/domain/actions/posts.actions";

export const usePostCard = (redirectTo = "/posts") => {
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = async (id: string) => {
        const formData = new FormData();
        formData.set("id", id);
        formData.set("redirectTo", redirectTo);
        await deletePostAction(formData);
    };

    const handleUpdate = async (formData: FormData) => {
        formData.set("redirectTo", redirectTo);
        await updatePostAction(formData);
        setIsEditing(false);
    };

    return {
        isEditing,
        setIsEditing,
        handleDelete,
        handleUpdate,
    };
};
