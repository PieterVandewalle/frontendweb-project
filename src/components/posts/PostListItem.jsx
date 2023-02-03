import { Button } from "flowbite-react";
import { AiOutlineDelete } from "react-icons/ai"
import { MdEdit } from "react-icons/md"
import { Link } from "react-router-dom";
import no_images from "../../images/no_images.svg";
import { useNavigate } from "react-router";
import { memo, useCallback } from "react";
import formatTitleForUrl from "../../utils/formatTitleForUrl";
import { formatCurrency } from "../../utils/formatCurrency";
import FavoriteButton from "../buttons/FavoriteButton";
import DateBadge from "../badges/DateBadge";
import CityBadge from "../badges/CityBadge";
import DeliveryTypeBadge from "../badges/DeliveryTypeBadge";

const PostListItem = ({ id, title, price, description, date, city, deliveryType, imageUrl, favorite, canEdit, onDelete, onFavorite }) => {
    const navigate = useNavigate();
    const onEdit = useCallback(() => navigate(`/my-account/posts/${id}/${formatTitleForUrl(title)}/edit`), [id, navigate, title]);
    const handleDelete = useCallback(() => onDelete(id), [id, onDelete]);
    const handleFavorite = useCallback(() => onFavorite(id, !favorite), [id, favorite, onFavorite]);
    const postLink = `/posts/${id}/${formatTitleForUrl(title)}`;

    return (
        <div className="card relative w-full" data-cy="post">
            {canEdit ? <>
                <div className="absolute right-[4.5rem] top-3 w-10">
                    <Button onClick={onEdit}> <MdEdit size={16} /></Button>
                </div>
                <div className="absolute right-4 top-3 w-10">
                    <Button color="light" onClick={handleDelete} data-cy="post_remove_btn"> <AiOutlineDelete size={16} /></Button>
                </div></> :
                <div className="absolute right-5 top-3 w-10">
                    <FavoriteButton onFavorite={handleFavorite} favorite={favorite} />
                </div>
            }
            <div className="flex flex-col lg:flex-row lg:justify-between mr-11 md:mr-14 gap-4 max-h-96 lg:h-36">
                <div className="lg:hidden">
                    <Link to={postLink}>
                        <h1 className="text-sm sm:text-lg text-primary-600 hover:text-primary-500 font-bold tracking-tight text-ellipsis overflow-hidden whitespace-nowrap" data-cy="post_title">
                            {title}
                        </h1>
                    </Link>
                </div>
                <div className="w-full sm:w-3/6 lg:w-2/6 xl:w-1/6 order-1 md:order-2 h-36">
                    <Link to={postLink}>
                        <img className="object-cover object-center h-full w-full bg-gray-800"
                            src={imageUrl ? imageUrl : no_images}
                            alt="product listed in post"
                        />
                    </Link>
                </div>
                <div className="lg:w-4/6 w-full order-2 md:order-2 flex flex-col gap-2">
                    <div className="hidden lg:block">
                        <Link to={postLink}>
                            <h1 className="text-base text-primary-600 hover:text-primary-500 lg:text-lg xl:text-xl font-bold tracking-tight">
                                {title}
                            </h1>
                        </Link>
                    </div>
                    <h2 className="w-full text-base md:text-lg xl:text-xl font-bold" data-cy="post_price">
                        {formatCurrency(price)}
                    </h2>
                    <p className="hidden lg:inline-block w-full h-10 xl:h-12 text-sm xl:text-base overflow-hidden">
                        {description}
                    </p>
                </div>
                <div className="flex lg:flex-col flex-wrap lg:justify-center gap-3 order-2 w-full lg:w-56">
                    <DateBadge date={date} />
                    <CityBadge city={city} />
                    <DeliveryTypeBadge deliveryType={deliveryType} inList={true} />
                </div>
            </div>
        </div >
    );
}

export default memo(PostListItem);