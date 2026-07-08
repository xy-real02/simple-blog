import type { PostSelect } from "@/lib/entities/posts.type";
import { useEffect, useState } from "react";

interface PostsTableProps {
    posts: PostSelect[];
}

export const usePostsTable = ({ posts }: PostsTableProps) => {
    const [postsData, setPostsData] = useState<PostSelect[]>(posts);

    useEffect(() => {
        setPostsData(posts);
    }, [posts]);

    return { postsData };
};
