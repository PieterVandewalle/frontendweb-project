import { Toast } from "flowbite-react";
import { Toaster, toast, ToastBar } from "react-hot-toast"
import { HiCheck, HiInformationCircle, HiX } from "react-icons/hi";

const ErrorIcon = () => {
    return (
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-800 text-red-200">
            <HiInformationCircle className="h-5 w-5" />
        </div>);
};

const SuccessIcon = () => {
    return (
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg  bg-green-800 text-green-200">
            <HiCheck className="h-5 w-5" />
        </div>);
};

const DeletedIcon = () => {
    return (<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg  text-red-500 bg-red-800 dtext-red-200">
        <HiX className="h-5 w-5" />
    </div>);
};

const toastOptions = {
    style: {
        padding: "0px",
        background: "transparent"
    }
}

//https://react-hot-toast.com/docs
const NotificationToast = () => {
    return (<Toaster
        position="top-center"
        toastOptions={toastOptions}
    >
        {(t) => {
            return (
                <ToastBar toast={t} >
                    {({ message }) => {
                        //Bij succesvol deleten geef ik { icon: "successDelete" } mee aan de toast, indien dit niet meegegeven is wordt het type (vb. success of error) gebruikt voor het icon te bepalen
                        const myIcon = t.icon || t.type;
                        return (<div className="dark">
                            <Toast>
                                {myIcon === "success" ? <SuccessIcon /> : myIcon === "successDelete" ? <DeletedIcon /> : <ErrorIcon />}
                                <div className="ml-3 text-sm font-normal text-white">{message}</div>
                                <button className="h-8 w-8 ml-auto hover:text-white flex items-center justify-center rounded-lg my-auto" onClick={(e) => {
                                    e.preventDefault();
                                    toast.remove(t.id);
                                }
                                }>
                                    <HiX size={20} /></button>
                            </Toast></div>
                        );
                    }}
                </ToastBar>);
        }}
    </Toaster>);
}



export default NotificationToast;
