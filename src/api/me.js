import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import{ axios} from ".";

const useMeApi = () =>{
	const {getAccessTokenSilently,} = useAuth0();

	const setToken = useCallback(async() => {
		const token = await getAccessTokenSilently();
		axios.defaults.headers.Authorization = `Bearer ${token}`;
	},[getAccessTokenSilently]);

	const getMyPosts = useCallback(async ({offset}) => {
		await setToken();
		const result = await axios.get(`me/posts`, {
        params:{
			offset: offset || 0,
			limit: 5
		}
	});
	return result.data;
	},[setToken]);

	const getMyFavoritePosts = useCallback(async ({offset}) => {
		await setToken();
		const result = await axios.get(`me/favorites`, {
			params:{
				offset: offset || 0,
				limit: 5
			}
    	});
	return result.data;
	},[setToken]);

	const addFavorite = useCallback(async (postId) => {
		await setToken();
		await axios.post(`me/favorites/${postId}`);
	},[setToken]);

	const deleteFavorite = useCallback(async (postId) => {
		await setToken();
		await axios.delete(`me/favorites/${postId}`);
	},[setToken]);

	const createMessage = useCallback(async(conversationId, {content}) => {
		await setToken();
		const {data} = await axios.post(`me/conversations/${conversationId}/messages`,{content});
		return data;
	},[setToken]);

	const getConversations = useCallback(async() => {
		await setToken();
		const {data} = await axios.get("me/conversations");
		return data;
	},[setToken]);


	const createConversation = useCallback(async({postId}) => {
		await setToken();
		const {data} = await axios.post(`me/conversations`,{
			postId
		});
		return data;
	},[setToken]);

	const getConversationById = useCallback(async(conversationId) => {
		await setToken();
		const {data} = await axios.get(`me/conversations/${conversationId}`);
		return data;
	},[setToken]);


	const deleteConversationById = useCallback(async(conversationId) => {
		await setToken();
		const {data} = await axios.delete(`me/conversations/${conversationId}`);
		return data;
	},[setToken]);

	const getProfile = useCallback(async() => {
		await setToken();
		const {data} = await axios.get("me/profile");
		return data;
	},[setToken]);

return {getMyPosts, getMyFavoritePosts, deleteFavorite, addFavorite, createMessage, getConversationById, getConversations, createConversation, deleteConversationById, getProfile}
}

export default useMeApi;