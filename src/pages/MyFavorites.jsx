import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import PostList from "../components/posts/PostList";
import PostListHeader from "../components/posts/PostListHeader";
import useMeApi from "../api/me";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import LoadingWrapper from "../components/LoadingWrapper";
import { useAddOrRemoveFavorite } from "../hooks/useAddOrRemoveFavorite";
import { useAuth0 } from "@auth0/auth0-react";
import pageToOffset from "../utils/pageToOffset";

const MyFavorites = () => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth0();
    const { getMyFavoritePosts } = useMeApi();
    const [searchParams] = useSearchParams();
    const { page } = useMemo(() => Object.fromEntries(searchParams), [searchParams]);
    const [visibleRefetch, setVisibleRefetch] = useState(true);

    const { isFetching, isSuccess, data, error, isLoading, isPreviousData, isRefetching } = useQuery({
        queryKey: ["myFavoritePosts", page],
        queryFn: async () => {
            const data = await getMyFavoritePosts({ offset: pageToOffset(page) });
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
    const headerText = `My Favorite Posts ${!isFetching && isSuccess ? `(${total})` : ""}`;

    const { mutate: toggleFavoritePost } = useAddOrRemoveFavorite({
        onMutate: async ({ postId, favorite }) => {
            //Optimistic update voor favorite
            // Cancel any outgoing refetches
            // (so they don"t overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["myFavoritePosts", page] });

            // Snapshot the previous value
            const previousFavoritesQuery = queryClient.getQueryData(["myFavoritePosts", page]);

            // Optimistically update to the new value
            queryClient.setQueryData(["myFavoritePosts", page], (oldData) => oldData ? ({ ...oldData, items: oldData.items.filter((oldPost) => oldPost.id !== postId) }) : oldData);

            // Return a context object with the snapshotted value
            return { previousFavoritesQuery }
        },
        onError: (error, variables, context) => {
            // If the mutation fails,
            // use the context returned from onMutate to roll back
            queryClient.setQueryData(["myFavoritePosts", page], context.previousFavoritesQuery);
        },
        onSettled: () => {
            //Deze refetch moet niet getoond worden, gebeurt in de achtergrond
            setVisibleRefetch(false);

            queryClient.invalidateQueries(["myFavoritePosts", page]);
        }
    });
    const handleFavorite = useCallback((postId, favorite) => {
        if (!isAuthenticated) {
            toast.error("Please login to favorite a post")
            return;
        }
        toggleFavoritePost({ postId, favorite });
    }, [toggleFavoritePost, isAuthenticated]);

    return (
        <div className="flex flex-col gap-3">
            <div className="card">
                <PostListHeader headerText={headerText} />
            </div>
            <LoadingWrapper isRefetching={isRefetching} isLoading={isLoading} error={error} loadingText={"Loading Your Favorite Posts"} visibleRefetch={visibleRefetch}>
                <PostList posts={posts} isPreviousData={isPreviousData} hasNext={hasNext} canEdit={false} onFavorite={handleFavorite} />
            </LoadingWrapper>
        </div >);
}
export default MyFavorites;