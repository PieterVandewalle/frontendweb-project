import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router";
import no_images from "../images/no_images.svg";
import { useGetPostById } from "../hooks/useGetPostById";
import { useAddOrRemoveFavorite } from "../hooks/useAddOrRemoveFavorite";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserInfo } from "../contexts/User.context";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Carousel, Modal } from "flowbite-react";
import postNotFound from "../images/postNotFound.svg";
import useMeApi from "../api/me";
import LoadingWrapper from "../components/LoadingWrapper";
import { formatCurrency } from "../utils/formatCurrency";
import MutationButton from "../components/buttons/MutationButton";
import FavoriteButton from "../components/buttons/FavoriteButton";
import DeliveryTypeBadge from "../components/badges/DeliveryTypeBadge";
import CityBadge from "../components/badges/CityBadge";
import DateBadge from "../components/badges/DateBadge";

const PostNotFound = () => {
    return (
        <div className="card gap-8 flex items-center justify-center">
            <h5 className="text-lg md:text-2xl font-semibold tracking-tight text-primary-500">This post does not exist (anymore)...</h5>
            <img className="w-44 h-44" src={postNotFound} alt="Not found"></img>
        </div>
    );
}

const ContactSellerModal = ({ show, postId, postOwnerUsername, onClose, }) => {
    const navigate = useNavigate();
    const { createConversation: addConversationToApi } = useMeApi();
    const { mutate: createConversation, isLoading: isCreating } = useMutation({
        mutationFn: async () => {
            const conversation = await addConversationToApi({ postId: postId });
            return conversation;
        },
        onSuccess: ({ id }) => {
            navigate(`/my-account/conversations/${id}`);
        },
        onError: (error) => {
            onClose();
            toast.error(`Unable to create conversation: ${error.message}`);
        }
    });

    const handleClose = () => {
        if (isCreating) return;
        onClose();
    }
    if (!show) return;

    return (
        <Modal
            show={true}
            position="center"
            onClose={handleClose}
        >
            <Modal.Header>
                Contact {postOwnerUsername}
            </Modal.Header>
            <Modal.Body>
                <div className="flex gap-2">
                    <MutationButton className="min-w-fit" onClick={createConversation} isMutating={isCreating} normalText="Create Conversation" mutatingText="Creating Conversation" />
                    <Button color={"light"} disabled={isCreating} onClick={handleClose}>Cancel</Button>
                </div>
            </Modal.Body>
        </Modal >);
}


const Post = () => {
    const [showContactSellerModal, setShowContactSellerModal] = useState(false);
    const { id } = useParams();
    const { isAuthenticated } = useAuth0();
    const queryClient = useQueryClient();
    const { id: userId } = useUserInfo();

    const { isLoading, data: post, isRefetching, error } = useGetPostById(id, {
        onError: (error) => {
            if (error.response.status !== 404)
                toast.error(`Error Loading Post: ${error.message}`);
        }
    });

    const { title, price, description, date, images, city, favorite, user: postOwner, deliveryType } = post || {};
    const { id: postOwnerId, username: postOwnerUsername } = postOwner || {};
    const hasImages = images && images.length !== 0;

    const { mutate: toggleFavoritePost } = useAddOrRemoveFavorite({
        onMutate: async ({ postId, favorite }) => {
            await queryClient.cancelQueries({ queryKey: ["post", postId] });

            const previousPost = queryClient.getQueryData(["post", postId]);
            queryClient.setQueryData(["post", postId], (oldData) => oldData ? ({ ...oldData, favorite: favorite }) : oldData);
            return { previousPost };
        },
        onError: (error, variables, context) => {
            queryClient.setQueryData(["post", variables.postId], context.previousPost);
        }
    });

    const handleFavorite = useCallback(() => {
        if (!isAuthenticated) {
            toast.error("Please login to favorite a post")
            return;
        }
        toggleFavoritePost({ postId: id, favorite: !favorite });
    }, [favorite, id, isAuthenticated, toggleFavoritePost]);


    const closeContactSellerModal = useCallback(() => setShowContactSellerModal(false), []);

    const openContactSellerModal = useCallback(() => {
        if (!isAuthenticated) {
            toast.error("Please login to contact a seller");
            return;
        }
        if (userId === postOwnerId) {
            toast.error("You cannot contact yourself..");
            return;
        }

        setShowContactSellerModal(true);
    }, [userId, isAuthenticated, postOwnerId]);


    if (error && error.response.status === 404) {
        return <PostNotFound />;
    }

    return (
        <><ContactSellerModal show={showContactSellerModal} postId={id} postOwnerUsername={postOwnerUsername} onClose={closeContactSellerModal} />
            <LoadingWrapper isRefetching={isRefetching} isLoading={isLoading} error={error} loadingText={"Loading Post"} visibleRefetch={false}>
                <div className="card">
                    <div className="flex justify-between items-start gap-1">
                        <h1 className="w-max text-base sm:text-xl md:text-2xl font-bold text-primary-600" data-cy="post_title">
                            {title}
                        </h1>
                        <FavoriteButton onFavorite={handleFavorite} favorite={favorite} />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <DateBadge date={date} />
                        <CityBadge city={city} />
                        <DeliveryTypeBadge deliveryType={deliveryType?.name} inList={true} />
                    </div>

                    <div className="h-72 2xl:h-80">
                        {hasImages ?
                            <Carousel slide={false} className="bg-gray-800 rounded-md">
                                {images.map(image => <img key={image.id} data-cy="post_image" className="w-fit h-full object-contain" src={image.url} alt="product listed in post" />)}
                            </Carousel>
                            :
                            <div className="bg-gray-800 rounded-md h-full flex justify-center items-center">
                                <img className="w-56"
                                    src={no_images}
                                    alt="no images"
                                /></div>
                        }
                    </div>
                    <h2 className="md:text-xl font-bold text-gray-900">
                        Price: <span data-cy="post_price">{formatCurrency(price)}</span>
                    </h2>
                    <h2 className="md:text-lg w-full font-bold text-gray-900">
                        Description
                    </h2>
                    <p className="font-normal text-gray-700 text-sm md:text-base break-all whitespace-pre-line max-h-96 overflow-y-scroll pr-3 sm:myScrollbar" data-cy="post_description">
                        {description}
                    </p>
                    <div className="border-primary-700 border-t-2 border-opacity-20 flex flex-col pt-4 items-start gap-2 text-primary">
                        <h2 className="text-center md:text-xl font-bold  text-gray-900">
                            Interested?
                        </h2>
                        <Button onClick={openContactSellerModal}>
                            Contact Seller
                        </Button>
                    </div>
                </div>
            </LoadingWrapper>
        </>
    );
}

export default Post;