import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useMeApi from "../api/me";

export const useAddOrRemoveFavorite = ({ onSuccess, onError, ...mutationOptions }) => {
    const {addFavorite, deleteFavorite} = useMeApi();
    return useMutation({
        mutationFn: async ({ postId, favorite }) => {
            if (favorite) {
                await addFavorite(postId);
            } else {
                await deleteFavorite(postId);
            }
            return { postId, favorite };
        },
        onSuccess: (data, variables, context) => {
            const { favorite } = variables;
            favorite ? toast.success(`Post added to favorites`) : toast.success(`Post removed from favorites`, { icon: "successDelete" });
            onSuccess && onSuccess(data, variables, context);
        },
        onError: (error, variables, context) => {
            toast.error(`Unable to ${variables.favorite ? "add post to" : "remove post from"} favorites: ${error.message}`);
            onError && onError(error, variables, context);
        },
        ...mutationOptions
    });
}