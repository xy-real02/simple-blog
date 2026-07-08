import type { PostSelect, PostWithAuthor } from "@/lib/entities/posts.type";
import { useEffect, useState } from "react";

interface PostsTableProps {
    posts: (PostSelect | PostWithAuthor)[];
}

export const usePostsTable = ({ posts }: PostsTableProps) => {
    const [postsData, setPostsData] = useState<(PostSelect | PostWithAuthor)[]>(posts);

    useEffect(() => {
        setPostsData(posts);
    }, [posts]);

    return { postsData };
};
