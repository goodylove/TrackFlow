import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { issueQueryKeys } from "@/feature/issues/services/issue-service";
import { apiClient } from "@/lib/api/api-client";
import {
  ApiError,
  extractFieldErrors,
  toApiError,
  type ApiResponse,
} from "@/lib/api/api-error";

export type IssueCommentAuthor = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type IssueComment = {
  id: string;
  content: string;
  author: IssueCommentAuthor;
  createdAt: string;
  updatedAt: string;
};

export type UpdateIssueCommentInput = {
  commentId: string;
  content: string;
};

type ApiComment = {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
};

type CommentListPayload = {
  comments: ApiComment[];
  pagination: {
    page: number;
    limit: number;
    totalComments: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type CommentListResult = Omit<CommentListPayload, "comments"> & {
  comments: IssueComment[];
};

export const commentQueryKeys = {
  all: ["issue-comments"] as const,
  list: (workspaceId: string, issueId: string) =>
    ["issue-comments", workspaceId, issueId, "list"] as const,
};

function toIssueComment(comment: ApiComment): IssueComment {
  return {
    id: comment._id,
    content: comment.content,
    author: {
      id: comment.author._id,
      name: comment.author.name,
      email: comment.author.email,
      avatarUrl: comment.author.avatarUrl,
    },
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

async function getIssueComments(
  workspaceId: string,
  issueId: string,
  page: number,
): Promise<CommentListResult> {
  try {
    const { data: payload } = await apiClient.get<
      ApiResponse<CommentListPayload>
    >(`/workspaces/${workspaceId}/issues/${issueId}/comments`, {
      params: { page, limit: 10 },
    });

    if (
      !payload.success ||
      !payload.data ||
      !Array.isArray(payload.data.comments)
    ) {
      throw new ApiError(payload.message || "Unable to load comments.");
    }

    return {
      ...payload.data,
      comments: payload.data.comments.map(toIssueComment),
    };
  } catch (error) {
    throw toApiError(error);
  }
}

async function createIssueComment(
  workspaceId: string,
  issueId: string,
  content: string,
) {
  try {
    const { data: payload } = await apiClient.post<ApiResponse<ApiComment>>(
      `/workspaces/${workspaceId}/issues/${issueId}/comments`,
      { content },
    );

    if (!payload.success || !payload.data) {
      throw new ApiError(payload.message || "Unable to add comment.", {
        fieldErrors: extractFieldErrors(payload.errors),
      });
    }

    return toIssueComment(payload.data);
  } catch (error) {
    throw toApiError(error);
  }
}

async function updateIssueComment(
  workspaceId: string,
  issueId: string,
  { commentId, content }: UpdateIssueCommentInput,
) {
  try {
    const { data: payload } = await apiClient.patch<ApiResponse<ApiComment>>(
      `/workspaces/${workspaceId}/issues/${issueId}/comments/${commentId}`,
      { content },
    );

    if (!payload.success || !payload.data) {
      throw new ApiError(payload.message || "Unable to update comment.", {
        fieldErrors: extractFieldErrors(payload.errors),
      });
    }

    return toIssueComment(payload.data);
  } catch (error) {
    throw toApiError(error);
  }
}

async function deleteIssueComment(
  workspaceId: string,
  issueId: string,
  commentId: string,
) {
  try {
    const { data: payload } = await apiClient.delete<ApiResponse<null>>(
      `/workspaces/${workspaceId}/issues/${issueId}/comments/${commentId}`,
    );

    if (!payload.success) {
      throw new ApiError(payload.message || "Unable to delete comment.");
    }

    return commentId;
  } catch (error) {
    throw toApiError(error);
  }
}

export function useIssueCommentsService(
  workspaceId: string,
  issueId: string,
) {
  return useInfiniteQuery({
    queryKey: commentQueryKeys.list(workspaceId, issueId),
    queryFn: ({ pageParam }) =>
      getIssueComments(workspaceId, issueId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
    enabled: Boolean(workspaceId && issueId),
  });
}

export function useCreateIssueCommentService(
  workspaceId: string,
  issueId: string,
) {
  const queryClient = useQueryClient();
  const queryKey = commentQueryKeys.list(workspaceId, issueId);

  return useMutation({
    mutationKey: ["issue-comments", workspaceId, issueId, "create"],
    mutationFn: (content: string) =>
      createIssueComment(workspaceId, issueId, content),
    onSuccess: (comment) => {
      queryClient.setQueryData<InfiniteData<CommentListResult>>(
        queryKey,
        (current) => {
          const firstPage = current?.pages[0];
          if (!current || !firstPage) return current;

          const totalComments = firstPage.pagination.totalComments + 1;
          const totalPages = Math.ceil(
            totalComments / firstPage.pagination.limit,
          );

          return {
            ...current,
            pages: [
              {
                ...firstPage,
                comments: [comment, ...firstPage.comments],
                pagination: {
                  ...firstPage.pagination,
                  totalComments,
                  totalPages,
                  hasNextPage: firstPage.pagination.page < totalPages,
                },
              },
              ...current.pages.slice(1),
            ],
          };
        },
      );

      void queryClient.invalidateQueries({
        queryKey: issueQueryKeys.list(workspaceId),
      });
    },
  });
}

export function useUpdateIssueCommentService(
  workspaceId: string,
  issueId: string,
) {
  const queryClient = useQueryClient();
  const queryKey = commentQueryKeys.list(workspaceId, issueId);

  return useMutation({
    mutationKey: ["issue-comments", workspaceId, issueId, "update"],
    mutationFn: (input: UpdateIssueCommentInput) =>
      updateIssueComment(workspaceId, issueId, input),
    onSuccess: (updatedComment) => {
      queryClient.setQueryData<InfiniteData<CommentListResult>>(
        queryKey,
        (current) =>
          current
            ? {
                ...current,
                pages: current.pages.map((page) => ({
                  ...page,
                  comments: page.comments.map((comment) =>
                    comment.id === updatedComment.id
                      ? updatedComment
                      : comment,
                  ),
                })),
              }
            : current,
      );
    },
  });
}

export function useDeleteIssueCommentService(
  workspaceId: string,
  issueId: string,
) {
  const queryClient = useQueryClient();
  const queryKey = commentQueryKeys.list(workspaceId, issueId);

  return useMutation({
    mutationKey: ["issue-comments", workspaceId, issueId, "delete"],
    mutationFn: (commentId: string) =>
      deleteIssueComment(workspaceId, issueId, commentId),
    onSuccess: (deletedCommentId) => {
      queryClient.setQueryData<InfiniteData<CommentListResult>>(
        queryKey,
        (current) => {
          const firstPage = current?.pages[0];
          if (!current || !firstPage) return current;

          const totalComments = Math.max(
            firstPage.pagination.totalComments - 1,
            0,
          );
          const totalPages = Math.ceil(
            totalComments / firstPage.pagination.limit,
          );

          return {
            ...current,
            pages: current.pages.map((page) => ({
              ...page,
              comments: page.comments.filter(
                (comment) => comment.id !== deletedCommentId,
              ),
              pagination: {
                ...page.pagination,
                totalComments,
                totalPages,
                hasNextPage: page.pagination.page < totalPages,
              },
            })),
          };
        },
      );

      void queryClient.invalidateQueries({ queryKey });
      void queryClient.invalidateQueries({
        queryKey: issueQueryKeys.list(workspaceId),
      });
    },
  });
}
