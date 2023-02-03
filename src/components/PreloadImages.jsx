import { useEffect } from "react";
import { useGetCategories } from "../hooks/useGetCategories";
import postNotFound from "../images/postNotFound.svg";
import notFound from '../images/notFound.svg';
import no_images from '../images/no_images.svg';
import success from '../images/success.svg';

//Preloads necessary images so that there is no delay when displaying them
const PreloadImages = () => {
    const { data: categories } = useGetCategories();

    useEffect(() => {
        if (!categories) return;
        categories.forEach(({ imageUrl }) => new Image().src = imageUrl);
    }, [categories]);

    useEffect(() => {
        [postNotFound, notFound, no_images, success].forEach(image => new Image().src = image);
    }, []);

    return null;
}
export default PreloadImages;