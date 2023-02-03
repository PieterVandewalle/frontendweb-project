import { useCallback } from "react";
import{ axios} from ".";

const useDeliveryTypesApi = () => {
    const getAll = useCallback(async () => {
        const result = await axios.get(
            'deliverytypes'
        );
        return result.data;
    },[]);
    return {getAll};
}
export default useDeliveryTypesApi;