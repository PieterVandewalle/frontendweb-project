import { useCallback } from "react";
import{ axios} from ".";
const useCategoriesApi = () => {
    const getAll = useCallback(async () => {
        const result = await axios.get(
            'categories'
        );
        return result.data;
    },[]);

    return {getAll};
}

export default useCategoriesApi;