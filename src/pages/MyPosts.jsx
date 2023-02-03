import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import PostList from "../components/posts/PostList";
import PostListHeader from "../components/posts/PostListHeader";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingWrapper from "../components/LoadingWrapper";
import DeleteModal from "../components/DeleteModal";
import useMeApi from "../api/me";
import { useAuth0 } from "@auth0/auth0-react";
import usePostsApi from "../api/posts";
import pageToOffset from "../utils/pageToOffset";


const MyPosts = () => {
    const { getMyPosts } = useMeApi();
    const { deletePostById } = usePostsApi();
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth0();
    const [searchParams] = useSearchParams();
    const { page } = useMemo(() => Object.fromEntries(searchParams), [searchParams]);

    const [visibleRefetch, setVisibleRefetch] = useState(true);
    const [idToDelete, setIdToDelete] = useState(null);

    const { isFetching, isRefetching, isSuccess, data, error, isPreviousData, isLoading } = useQuery({
        queryKey: ["myPosts", page],
        queryFn: async () => {
            //Page omvormen naar offset
            const data = await getMyPosts({ offset: pageToOffset(page) });
            return data;
        },
        onSettled: () => {
            setVisibleRefetch(true);
        },
        enabled: !!isAuthenticated,
        keepPreviousData: true,
    });

    const posts = data?.items;
    const total = data?.total_posts || 0;
    const hasNext = data?.hasNext || false;
    const headerText = `My Posts ${!isFetching && isSuccess ? `(${total})` : ""}`;

    const { mutate: deletePost, } = useMutation({
        mutationFn: async (id) => {
            await deletePostById(id);
        },
        onMutate: async (id) => {
            //Optimistic update 
            // Cancel any outgoing refetches
            // (so they don"t overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["myPosts", page] });

            // Snapshot the previous value
            const previousPostsQuery = queryClient.getQueryData(["myPosts", page]);

            // Optimistically update to the new value
            queryClient.setQueryData(["myPosts", page], (oldData) => oldData ? ({ ...oldData, items: oldData.items.filter((oldPost) => oldPost.id !== id) }) : oldData);

            // Return a context object with the snapshotted value
            return { previousPostsQuery }
        },
        onSuccess: () => {
            toast.success("Post deleted", { icon: "successDelete" });
        },
        onError: (error, variables, context) => {
            toast.error(`Unable to delete post: ${error.message}`);
            // If the mutation fails,
            // use the context returned from onMutate to roll back
            queryClient.setQueryData(["myPosts", page], context.previousPostsQuery);
        },
        onSettled: () => {
            //Deze refetch moet niet getoond worden, gebeurt in de achtergrond
            setVisibleRefetch(false);

            queryClient.invalidateQueries(["myPosts", page]);
        }
    });

    const handleDelete = useCallback((id) => setIdToDelete(id), []);
    const onCancelDelete = useCallback(() => setIdToDelete(null), []);
    const onDeleteConfirm = useCallback(() => {
        deletePost(idToDelete)
        setIdToDelete(null);
    }, [deletePost, idToDelete]);

    return (
        <div className="flex flex-col gap-3">
            <DeleteModal show={Boolean(idToDelete)} onClose={onCancelDelete} onConfirm={onDeleteConfirm} questionText="Are you sure you want to delete this post?" />
            <div className="card">
                <PostListHeader headerText={headerText} />
            </div>
            <LoadingWrapper isRefetching={isRefetching} isLoading={isLoading} error={error} loadingText={"Loading Posts"} visibleRefetch={visibleRefetch}>
                <PostList posts={posts} isPreviousData={isPreviousData} hasNext={hasNext} canEdit={true} onDelete={handleDelete} /> :
            </LoadingWrapper>
        </div>);
}
export default MyPosts;