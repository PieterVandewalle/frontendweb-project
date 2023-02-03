import { memo, useCallback, useState, useMemo } from "react";
import { FormProvider, useForm, useFormContext, } from "react-hook-form";
import { useParams } from "react-router";
import { useSearchParams, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { RiImageAddFill } from "react-icons/ri"
import { TbCurrencyEuro } from "react-icons/tb";
import { GrLocation } from "react-icons/gr";
import successIllustration from "../images/success.svg";
import { Button, Label, Textarea } from "flowbite-react";
import { useGetCategories } from "../hooks/useGetCategories";
import { useGetDeliveryTypes } from "../hooks/useGetDeliveryTypes";
import { useGetPostById } from "../hooks/useGetPostById";
import formatTitleForUrl from "../utils/formatTitleForUrl";
import usePostsApi from "../api/posts";
import LabelTextInput from "../components/formInputs/LabelTextInput";
import LoadingWrapper from "../components/LoadingWrapper";
import MutationButton from "../components/buttons/MutationButton";
import LabelSelectWithQuery from "../components/formInputs/LabelSelectWithQuery";

const validationRules = {
    title: {
        required: "Please provide a title",
        minLength: { value: 2, message: "Please provide a title that has 2-50 characters" },
        maxLength: { value: 50, message: "Please provide a title that has 2-50 characters" }
    },
    category: { required: "Please select a category" },
    deliveryType: { required: "Please select a delivery type" },
    description: {
        maxLength: { value: 5000, message: "Please provide a title that has 2-5000 characters" }
    },
    city: {
        required: "Please provide a city",
        minLength: { value: 2, message: "Please provide a valid city" },
        maxLength: { value: 50, message: "Please provide a valid city" }
    },
    price: {
        valueAsNumber: true,
        required: "Please provide a price",
        min: { value: 0, message: "Please provide a price between 0 and 100000" },
        max: { value: 100000, message: "Please provide a price between 0 and 100000" },
    }
};

const ImageInput = memo(function ({ index, previewSource, onFileInputChange, onFileDelete }) {
    const handleFileInputChange = useCallback((e) => {
        const file = e.target.files[0];
        onFileInputChange(index, file);
        e.target.value = null;
    }, [index, onFileInputChange]);

    const handleFileDelete = useCallback(() => onFileDelete(index), [index, onFileDelete]);

    return (
        <div className="w-50 flex items-center">
            {previewSource ?
                <div className="relative group">
                    <img
                        src={previewSource}
                        alt="chosen"
                        className="h-28 w-28 object-cover"
                        data-cy={`image_${index}_previewSource`}
                    />
                    <div className="md:opacity-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:opacity-90 transition-all duration-200">
                        <Button size="sm" color={"light"} onClick={handleFileDelete} data-cy={`image_${index}_remove`}>Remove</Button></div>
                </div>
                :
                <label htmlFor={"fileInput" + index} className="cursor-pointer hover:opacity-70 transition-all duration-200" data-cy={`image_${index}_input`}>
                    <RiImageAddFill size={100} />
                </label>
            }
            <input
                disabled={previewSource}
                id={"fileInput" + index}
                type="file"
                name="image"
                className="hidden"
                accept="image/*"
                onChange={handleFileInputChange}
            />
        </div>
    );
});

const LabelImageInputList = memo(function ({ numberOfImages, imageData, onFileInputChange, onFileDelete }) {
    return (
        <div className="w-full">
            <div className="mb-2 block">
                <Label value="Images" />
            </div>
            <div className="flex gap-4 flex-wrap">
                {[...Array(numberOfImages)].map((el, i) =>
                    i < imageData.filter((imageData) => imageData.hasOwnProperty("previewSource")).length + 1 && <ImageInput key={i} index={i} previewSource={imageData[i]["previewSource"]} onFileInputChange={onFileInputChange} onFileDelete={onFileDelete} />)
                }
            </div>
        </div>
    );
});


const LabelTextArea = memo(function ({ label, name, type, validationRules, className, rows, ...rest }) {
    const { register, errors, isSubmitting } = useFormContext();
    const hasError = name in errors;

    return (
        <div className={className}>
            <div className="mb-2 block">
                <Label htmlFor={name} value={label} />
            </div>
            <Textarea {...register(name, validationRules)} rows={rows} id={name} disabled={isSubmitting} type={type} sizing="md" helperText={hasError && <span className="font-semibold text-red-600">{errors[name].message}</span>} {...rest} />
        </div>
    );

});


const Confirmation = ({ confirmationText, savedPostPath }) => {
    return (
        <div className="card gap-8 items-center">
            <h5 className="text-xl md:text-2xl font-semibold tracking-tight text-primary">{confirmationText}</h5>
            <img className="w-52 h-52" alt="success" src={successIllustration}></img>
            <Link to={savedPostPath} data-cy="view_created_post_btn"><Button className="w-28">View Post</Button></Link>
        </div>
    );
}
const NUMBER_OF_IMAGES = 5;

const PostForm = () => {
    const { id } = useParams();
    const { save: saveToApi } = usePostsApi();
    const VALID_FILETYPES = useMemo(() => ["image/jpg", "image/jpeg", "image/png"], []);
    const [imageData, setImageData] = useState(new Array(NUMBER_OF_IMAGES).fill({}));

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();
    const [searchParams, setSearchParams] = useSearchParams();

    const { isLoading, error, isRefetching } = useGetPostById(id, {
        onSuccess: ({ title, description, price, city, deliveryType: { id: deliveryTypeId }, category: { id: categoryId }, images: postImages }) => {
            setValue("title", title);
            setValue("price", price);
            setValue("deliveryType", deliveryTypeId);
            setValue("category", categoryId);
            setValue("description", description);
            setValue("city", city);
            setImageData(postImages.map((image) => ({ image: image, previewSource: image.url })).concat(new Array(NUMBER_OF_IMAGES - postImages.length).fill({})));
        }
    });

    const previewFile = useCallback((index, file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImageData(prevImageData => prevImageData.map((imageData, i) => i === index ? ({ ...imageData, previewSource: reader.result }) : imageData));
        };
    }, []);

    const isValidFileType = useCallback(({ type }) => VALID_FILETYPES.includes(type), [VALID_FILETYPES]);

    const handleFileInputChange = useCallback((index, file) => {
        if (!isValidFileType(file)) {
            toast.error("Only jpg/jpeg and png files are allowed!");
            return;
        }
        setImageData(prevImageData => prevImageData.map((imageData, i) => i === index ? ({ ...imageData, file: file }) : imageData));
        previewFile(index, file);
    }, [previewFile, isValidFileType]);

    //Delete imageData + shift items to the left (if there is a gap after deleting)
    const handleDeleteFile = useCallback((index) => setImageData(prevImageData => prevImageData.map((imageData, i, arr) => i < index ? imageData : (i >= index && i + 1 !== arr.length) ? arr[i + 1] : {})), []);

    const resetForm = useCallback(() => {
        reset();
        setImageData(new Array(NUMBER_OF_IMAGES).fill({}));
    }, [reset]);

    const save = useCallback(async (data) => {
        const formData = new FormData();
        imageData.filter((imageData) => imageData.file).forEach((imageData) => formData.append("image", imageData.file));
        const { title, price, category, description, deliveryType, city } = data;
        const postData = {
            title: title,
            description: description,
            price: price,
            categoryId: category,
            deliveryTypeId: deliveryType,
            city: city,
            images: JSON.stringify(imageData.filter((imageData) => imageData.image).map(({ image }) => image)),
        };
        Object.entries(postData).forEach((entry) => formData.append(entry[0], entry[1]));
        const savedPost = await saveToApi(formData, id);
        resetForm();
        return savedPost;
    }, [id, resetForm, saveToApi, imageData]);

    const { mutate: savePost, isLoading: isSavingPost, data: savedPost } = useMutation(save, {
        onError: (error) => toast.error(`Error saving post: ${error.message}`),
        onSuccess: () => setSearchParams({ success: "true" }),
    });

    if (savedPost && searchParams.get("success"))
        return <Confirmation confirmationText={`Post successfully ${id ? "saved" : "created"}!`} savedPostPath={`/posts/${savedPost.id}/${formatTitleForUrl(savedPost.title)}`} />

    return (
        <LoadingWrapper isRefetching={isRefetching} isLoading={id && (isLoading || isRefetching)} error={error} loadingText={"Loading Post"} visibleRefetch={false}>
            <div className="card">
                <h5 className="w-full text-lg md:text-2xl font-bold tracking-tight">{id ? "Edit Post" : "New Post"}</h5>
                <FormProvider handleSubmit={handleSubmit} register={register} setValue={setValue} errors={errors} isSubmitting={isSubmitting}>
                    <form className="flex flex-wrap gap-4" onSubmit={handleSubmit(savePost)}>
                        <LabelTextInput className="w-full sm:w-96" name={"title"} label="Title (50 characters max)" type={"text"} placeholder={"What are you selling?"} validationRules={validationRules["title"]} maxLength={50} data-cy="title_input" />
                        <LabelTextInput icon={TbCurrencyEuro} className={"w-full sm:w-52"} name={"price"} label="Price" type={"number"} step="0.01" min="0" placeholder={"0,00"} validationRules={validationRules["price"]} data-cy="price_input" />
                        <LabelSelectWithQuery className="w-full sm:w-52" name="category" label="Category" labelPlural="categories" useGetOptionsQuery={useGetCategories} validationRules={validationRules["category"]} defaultText={`-- Select a category --`} data-cy="category_input" />
                        <LabelSelectWithQuery className="w-full sm:w-52" name="deliveryType" label="Delivery type" labelPlural="delivery types" useGetOptionsQuery={useGetDeliveryTypes} validationRules={validationRules["deliveryType"]} defaultText={`-- Select a delivery type --`} data-cy="deliveryType_input" />
                        <LabelTextInput icon={GrLocation} className={"w-full sm:w-72"} name={"city"} label="City" type={"text"} placeholder={"Where can people get the product?"} validationRules={validationRules["city"]} data-cy="city_input" />
                        <LabelImageInputList numberOfImages={NUMBER_OF_IMAGES} imageData={imageData} onFileInputChange={handleFileInputChange} onFileDelete={handleDeleteFile} />
                        <LabelTextArea className="w-full" name={"description"} label="Description" type={"textarea"} placeholder={"Describe the product you are selling..."} validationRules={validationRules["description"]} rows={10} maxLength={5000} data-cy="description_input" />
                        <MutationButton type="submit" className="w-full" isMutating={isSavingPost} mutatingText={id ? "Saving Post" : "Creating Post"} normalText={id ? "Save Post" : "Create Post"} data-cy="submit_post" />
                    </form>
                </FormProvider >
            </div>
        </LoadingWrapper>
    );
}

export default memo(PostForm);