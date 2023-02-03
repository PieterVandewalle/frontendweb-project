import { useQuery } from "@tanstack/react-query";
import useCategoriesApi from "../api/categories";

export const useGetCategories = (queryOptions) => {
    const {getAll} = useCategoriesApi();
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const result = await getAll();
            return result.items;
        },
        staleTime:5 * 60 * 1000,
        ...queryOptions
    });
}
