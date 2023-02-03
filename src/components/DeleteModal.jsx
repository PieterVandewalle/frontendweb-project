import { Button, Modal } from "flowbite-react";
import { memo } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DeleteModal = ({ show, onClose, onConfirm, questionText }) => {
    if (!show)
        return;

    return (
        <Modal
            show={true}
            size="md"
            popup={true}
            onClose={onClose}
        >
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        {questionText}
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button
                            color="failure"
                            onClick={onConfirm}
                            data-cy="delete_confirm_btn"
                        >
                            Yes, I'm sure
                        </Button>
                        <Button
                            color="gray"
                            onClick={onClose}
                        >
                            No, cancel
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default memo(DeleteModal);