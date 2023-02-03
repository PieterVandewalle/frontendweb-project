import { useQuery } from "@tanstack/react-query";
import usePostsApi from "../api/posts";

export const useGetPostById = (id, {...queryOptions}) => {
    const {getById} = usePostsApi();

    return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
        const post = await getById(id);
        return post;
    },
    enabled: !!id,
    ...queryOptions
});
}