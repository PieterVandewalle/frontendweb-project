import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import PostList from "../components/posts/PostList";
import PostListFilter from "../components/posts/PostListFilter";
import PostListHeader from "../components/posts/PostListHeader";
import { toast } from "react-hot-toast";
import LoadingWrapper from "../components/LoadingWrapper";
import { useAddOrRemoveFavorite } from "../hooks/useAddOrRemoveFavorite";
import { useAuth0 } from "@auth0/auth0-react";
import usePostsApi from "../api/posts";
import { useState } from "react";
import { useEffect } from "react";
import pageToOffset from "../utils/pageToOffset";

const Home = () => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth0();
    const { categoryId, categoryName } = useParams();
    const { getAll } = usePostsApi();
    const [searchParams] = useSearchParams();
    const { searchterm, minPrice, maxPrice, deliveryTypeId, order, page } = useMemo(() => Object.fromEntries(searchParams), [searchParams]);
    const [visibleRefetch, setVisibleRefetch] = useState(true);
    const [totalWithoutFilters, setTotalWithoutFilters] = useState(null);

    //Als zoekopdracht veranderd is wordt totalWithoutFilters op null gezet zodat het bij de volgende query wordt ingesteld
    useEffect(() => {
        setTotalWithoutFilters(null);
    }, [searchterm]);

    const { isFetching, data, error, isPreviousData, isLoading } = useQuery({
        queryKey: ["posts", searchterm, minPrice, maxPrice, deliveryTypeId, order, page, categoryId],
        queryFn: async () => {
            const posts = await getAll({ searchterm, minPrice, maxPrice, deliveryTypeId, order, categoryId, offset: pageToOffset(page) });
            return posts;
        },
        onSuccess: (data) => {
            //Totaal wordt enkel ingesteld bij de eerste keer laden van een pagina na zoekopdracht
            if (!totalWithoutFilters)
                setTotalWithoutFilters(data.total_posts);
        },
        onSettled: () => {
            setVisibleRefetch(true);
        },
        retry: 1,
        keepPreviousData: true,
    });

    const posts = data?.items;
    const total = data?.total_posts || 0;
    const hasNext = data?.hasNext || false;

    const { mutate: toggleFavoritePost } = useAddOrRemoveFavorite({
        onMutate: async ({ postId, favorite }) => {
            //Optimistic update voor favorite
            //https://tanstack.com/query/v4/docs/guides/optimistic-updates
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["posts"] });

            // Snapshot the previous value
            const previousPostsQueries = queryClient.getQueriesData(["posts"]);

            // Optimistically update to the new value
            queryClient.setQueriesData(["posts"], (oldData) => oldData ? ({ ...oldData, items: oldData.items.map((oldPost) => oldPost.id === postId ? ({ ...oldPost, favorite: favorite }) : oldPost) }) : oldData);

            // Return a context object with the snapshotted value
            return { previousPostsQueries }
        },
        onError: (error, variables, context) => {
            // If the mutation fails,
            // use the context returned from onMutate to roll back
            context.previousPostsQueries.forEach((previousPostQuery) => queryClient.setQueryData(previousPostQuery[0], previousPostQuery[1]));
        },
        onSettled: () => {
            //Deze refetch moet niet getoond worden, gebeurt in de achtergrond
            setVisibleRefetch(false);

            queryClient.invalidateQueries(["posts"]);
        }
    });


    const handleFavorite = useCallback((postId, favorite) => {
        if (!isAuthenticated) {
            toast.error("Please login to favorite a post")
            return;
        }
        toggleFavoritePost({ postId, favorite });
    }, [isAuthenticated, toggleFavoritePost]);

    //Titel bovenaan is verschillend naargelang er een zoekopdracht is gebeurd of men zich in een bepaalde categorie bevindt
    const headerBaseText = categoryName ? categoryName : "Posts";
    const headerTextSearch = `${totalWithoutFilters} result${totalWithoutFilters !== 1 ? "s" : ""} for '${searchterm}' ${categoryName ? `in ${categoryName}` : ""}`;
    const headerText = searchterm && totalWithoutFilters != null ? headerTextSearch : headerBaseText;

    return (
        <div className="flex flex-col gap-3">
            <div className="card">
                <PostListHeader headerText={headerText} />
                <PostListFilter numberOfResults={total} />
            </div>
            <LoadingWrapper isRefetching={isFetching} isLoading={isLoading} error={error} loadingText={"Loading Posts"} visibleRefetch={visibleRefetch}>
                <PostList posts={posts} isPreviousData={isPreviousData} hasNext={hasNext} canEdit={false} onFavorite={handleFavorite} />
            </LoadingWrapper >
        </div>);
}
export default Home;