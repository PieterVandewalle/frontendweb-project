import { Button } from "flowbite-react";
import { memo } from "react";
import { BsStarFill } from "react-icons/bs";

const FavoriteButton = ({ onFavorite, favorite }) => {
    return (
        <Button onClick={onFavorite} color="light" pill={true} className='w-12'>
            <BsStarFill size={17} className={`${favorite ? 'fill-primary' : 'fill-gray-400'}`} />
        </Button>
    );
}

export default memo(FavoriteButton);