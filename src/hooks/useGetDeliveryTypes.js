import { useQuery } from "@tanstack/react-query";
import useDeliveryTypesApi from "../api/deliveryTypes";

export const useGetDeliveryTypes = () => {
    const {getAll} = useDeliveryTypesApi();
    return useQuery({
        queryKey: ["deliveryTypes"],
        queryFn: async () => {
            const result = await getAll();
            return result.items;
        },
        staleTime:5 * 60 * 1000,
    });
}