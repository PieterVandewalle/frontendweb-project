import {
  useAuth0
} from '@auth0/auth0-react';
import {
  useCallback
} from 'react';
import {
  axios,
} from ".";


const usePostsApi = () => {
  const {
    getAccessTokenSilently,
  } = useAuth0();

  const setToken = useCallback(async() => {
			const token = await getAccessTokenSilently();
			axios.defaults.headers.Authorization = `Bearer ${token}`;
	},[getAccessTokenSilently]);

  //Voor routes waarbij inloggen optioneel is
  const setTokenWithoutThrowing = useCallback(async() =>{
    try {
      await setToken();
    }catch (error) {
			if (error.message !== "Login required"){
        throw error;
      }
			delete axios.defaults.headers.Authorization;
		}
  },[setToken]);


  const getById = useCallback(async (id) => {
    await setTokenWithoutThrowing();
    const result = await axios.get(
      `posts/${id}`
    );
    return result.data;
  }, [setTokenWithoutThrowing]);

  const getAll = useCallback(async (queryParams) => {
    await setTokenWithoutThrowing();
    Object.keys(queryParams).forEach(key => !queryParams[key] && delete queryParams[key]);
    const result = await axios.get('posts', {
      params: {
        ...queryParams,
        order: queryParams.order || 'date-desc',
        limit: 5,
        offset: queryParams.offset || 0,
      }
    });
    return result.data;
  }, [setTokenWithoutThrowing]);


  const deletePostById = useCallback(async (id) => {
    await setToken();
    await axios.delete(`posts/${id}`);
  }, [setToken]);


  const save = useCallback(async (formData, id) => {
    await setToken();
    const result = await axios({
      method: id ? 'PUT' : 'POST',
      url: `posts/${id ?? ''}`,
      data: formData,
      config: {
        Headers: {
          "content-type": "multipart/form-data"
        }
      }
    });
    return result.data;
  }, [setToken]);
  return {
    getById,
    getAll,
    save,
    deletePostById
  };
}

export default usePostsApi;