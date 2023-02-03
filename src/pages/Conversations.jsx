import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "flowbite-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { BsFillChatDotsFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import useMeApi from "../api/me";
import DeleteModal from "../components/DeleteModal";
import LoadingWrapper from "../components/LoadingWrapper";
import { useUserInfo } from "../contexts/User.context";
import { formatDateInChat } from "../utils/formatDateInChat";
import formatTitleForUrl from "../utils/formatTitleForUrl";


const ConversationListItem = ({ conversationId, postId, title, username, lastMessageContent, lastMessageTimestamp, onDelete }) => {

    const handleDelete = useCallback(() => onDelete(conversationId), [conversationId, onDelete]);

    return (
        <div className="card flex flex-col justify-between gap-2 rounded-lg p-3">
            <div className="relative">
                <div className="absolute right-0">
                    <Button color="light" onClick={handleDelete} size="sm"> <AiOutlineDelete size={16} /></Button>
                </div>
            </div>
            <div className="flex flex-col gap-2 pr-10">
                <div className="font-semibold">{username} &nbsp;{"|"}&nbsp; {title}</div>
                <div className="flex gap-2">
                    <div className="text-sm text-gray-500 min-w-fit">{lastMessageTimestamp && formatDateInChat(new Date(lastMessageTimestamp))}</div>
                    <div className="text-sm text-gray-500 truncate">{lastMessageContent}</div>
                </div>
            </div>

            <div className="flex gap-2 pr-6">
                <Link to={`${conversationId}`}><Button size={"sm"}><span className="flex gap-2 items-center">Chat <BsFillChatDotsFill /></span></Button></Link>
                <Link to={`/posts/${postId}/${formatTitleForUrl(title)}`}><div className="w-24"><Button size="sm" color="light">View Post</Button></div></Link>
            </div>
        </div>
    );
}
const ConversationList = () => {
    const queryClient = useQueryClient();
    const { id: userId } = useUserInfo();
    const { deleteConversationById, getConversations } = useMeApi();
    const REFETCH_INTERVAL_SECONDS = 10;
    const [idToDelete, setIdToDelete] = useState(null);

    //Conversations ophalen
    const { data, isLoading, error, isRefetching } = useQuery({
        queryKey: ["myConversations"],
        queryFn: async () => {
            const data = await getConversations();
            return data;
        },
        refetchInterval: 1000 * REFETCH_INTERVAL_SECONDS,

    });
    const conversations = data?.items || [];

    //Conversation verwijderen
    const { mutate: deleteConversation } = useMutation({
        mutationFn: async (conversationId) => {
            await deleteConversationById(conversationId);
        },
        onSuccess: () => {
            toast.success(`Conversation deleted`, { icon: "successDelete" })
            queryClient.invalidateQueries({ queryKey: ["myConversations"] });
        },
        onError: (error) => {
            toast.error(`Unable to delete conversation: ${error.message}`);
        }
    });

    //Modal wordt getoond als er een idToDelete is
    const handleDelete = useCallback((id) => setIdToDelete(id), []);
    const onCancelDelete = useCallback(() => setIdToDelete(null), []);
    const onDeleteConfirm = useCallback(() => {
        deleteConversation(idToDelete)
        setIdToDelete(null);
    }, [deleteConversation, idToDelete]);


    return (
        <LoadingWrapper isRefetching={isRefetching} isLoading={isLoading} error={error} loadingText={"Loading Conversations"} visibleRefetch={false}>
            <div className="container mx-auto flex flex-col gap-2">
                <DeleteModal show={Boolean(idToDelete)} onClose={onCancelDelete} onConfirm={onDeleteConfirm} questionText="Are you sure you want to delete this conversation?" />
                <div className="card flex flex-col gap-4">
                    <h3 className="border-b p-2 font-bold text-xl">My Conversations</h3>
                    {conversations.length === 0 ?
                        <div>You have do not have any conversations...</div>
                        :
                        <div className="flex flex-col gap-4 h-96 overflow-y-scroll sm:myScrollbar pr-3 sm:pr-8">
                            {conversations.map((conversation, i) => <ConversationListItem key={conversation.id} conversationId={conversation.id} postId={conversation.post.id} title={conversation.post.title} username={conversation.postOwner.id === userId ? conversation.postReplier.username : conversation.postOwner.username} lastMessageContent={conversation.lastMessage?.content} lastMessageTimestamp={conversation.lastMessage?.timestamp} onDelete={handleDelete} />)}
                        </div>
                    }
                </div>
            </div>
        </LoadingWrapper >);
}



const Conversations = () => {
    return <ConversationList />
}

export default Conversations;