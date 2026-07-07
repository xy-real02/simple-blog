import { getPosts as getPostsUseCase } from "../usecases/posts/get_posts.usecase";
import { getPostById as getPostByIdUseCase } from "../usecases/posts/get_post_by_id.usecase";
import { createPost as createPostUseCase } from "../usecases/posts/create_posts.usecase";
import { updatePost as updatePostUseCase } from "../usecases/posts/update_post.usecase";
import { deletePost as deletePostUseCase } from "../usecases/posts/delete_post.usecase";
import type {
  CreatePostInput,
  DeletePostInput,
  PostResult,
  PostSelect,
  UpdatePostInput,
} from "@/lib/entities/posts.type";

export async function getPosts(): Promise<PostSelect[]> {
  return getPostsUseCase();
}

export async function getPostById(id: string): Promise<PostSelect | null> {
  return getPostByIdUseCase(id);
}

export async function createPost(
  input: CreatePostInput,
  authorId: string
): Promise<PostResult<PostSelect>> {
  return createPostUseCase(input, authorId);
}

export async function updatePost(input: UpdatePostInput): Promise<PostResult> {
  return updatePostUseCase(input);
}

export async function deletePost(input: DeletePostInput): Promise<PostResult> {
  return deletePostUseCase(input);
}
