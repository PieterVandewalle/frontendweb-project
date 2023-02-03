import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, TextInput } from "flowbite-react";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { formatDateInChat } from "../utils/formatDateInChat";
import useMeApi from "../api/me";
import { useUserInfo } from "../contexts/User.context";
import LoadingWrapper from "../components/LoadingWrapper";
import { Link } from "react-router-dom";
import formatTitleForUrl from "../utils/formatTitleForUrl";
import { BiConversation } from "react-icons/bi";
import MutationButton from "../components/buttons/MutationButton";

const MessageBox = ({ message, isSender, timestamp }) => {
    return (
        <div className={`relative w-7/12 text-xs md:text-sm text-left p-4 rounded-lg ${isSender ? "bg-primary-300 ml-auto" : "bg-gray-100 mr-auto"}`}>{message}
            <div className="absolute text-xs md:text-sm text-gray-500 bottom-1 right-1">{timestamp}</div>
        </div>

    );
}

const MessageList = ({ messages, userId }) => {
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, [messages]);

    return (
        <div className="flex flex-col gap-4 h-96 overflow-y-scroll sm:myScrollbar pr-2 sm:pr-8 ">
            {messages.map((message) => <MessageBox key={message.id} isSender={message.sender.id === userId} message={message.content} timestamp={formatDateInChat(new Date(message.timestamp))} />)}
            <div ref={messagesEndRef}></div>
        </div>
    )
}


const Chat = () => {
    const { getConversationById, createMessage } = useMeApi();
    const queryClient = useQueryClient();
    const { id: userId } = useUserInfo();
    const { conversationId } = useParams();
    const REFETCH_INTERVAL_SECONDS = 5;
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const { data, isLoading, error, isRefetching } = useQuery({
        queryKey: ["conversation", conversationId],
        refetchInterval: 1000 * REFETCH_INTERVAL_SECONDS,
        queryFn: async () => {
            const data = await getConversationById(conversationId);
            return data;
        },
        enabled: !!conversationId
    });

    const { post, postOwner, postReplier, deletedByPostOwner, deletedByPostReplier } = data || {};
    const messages = data?.messages || [];
    const { title, id } = post || {};
    const { username: usernamePostOwner, id: idPostOwner } = postOwner || {};
    const { username: usernamePostReplier } = postReplier || {};
    const isPostOwner = idPostOwner === userId;
    const isDeleted = deletedByPostOwner || deletedByPostReplier;
    const usernameOther = isPostOwner ? usernamePostReplier : usernamePostOwner;

    const { mutate: sendMessage, isLoading: isSending } = useMutation({
        mutationFn: async ({ content }) => await createMessage(conversationId, { content }),
        onSuccess: () => {
            reset();
            queryClient.invalidateQueries(["conversation", conversationId]);
        },
        onError: (error) => toast.error(`Unable to send message: ${error.message}`)
    });

    return (
        <LoadingWrapper isRefetching={isRefetching} isLoading={isLoading} error={error} loadingText={"Loading Conversation"} visibleRefetch={false}>
            <div className="flex flex-col gap-2 container mx-auto">
                <Link to={"/my-account/conversations"}><Button className="w-max" color={"light"}><div className="flex gap-2 items-center"><BiConversation />View all conversations</div></Button></Link>
                <div className="card">
                    <div className="border-b border-primary font-semibold text-primary text:sm sm:text-lg hover:text-primary-400">{usernameOther} &nbsp;{'|'}&nbsp; <Link to={`/posts/${id}/${formatTitleForUrl(title)}`}>{title}</Link></div>
                    <MessageList messages={messages} userId={userId} />
                    <form className="flex gap-1" onSubmit={handleSubmit(sendMessage)}>
                        <div className="w-full">
                            <TextInput
                                {...register("content", { required: 'Please provide a message', maxLength: { value: 255, message: "Message cannot be longer than 255 characters" } })}
                                disabled={isSubmitting || isSending || isDeleted}
                                type="text"
                                placeholder={isDeleted ? `${usernameOther} has left the conversation...` : "Send a new message"}
                                helperText={"content" in errors && <span className="font-semibold text-red-600">{errors.content.message}</span>}
                            />
                        </div>
                        <MutationButton type="submit" className="min-w-fit" isMutating={isSending} normalText="Send" mutatingText={"Sending"} />
                    </form>
                </div >
            </div>
        </LoadingWrapper>);
}

export default Chat;