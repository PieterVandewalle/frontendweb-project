import { Badge } from "flowbite-react";
import { memo } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import capitalize from "../../utils/capitalize";

const CityBadge = ({ city, ...rest }) => {
    return (
        <div className="w-max">
            <Badge
                icon={HiOutlineLocationMarker}
                {...rest}
            >
                <span data-cy="post_city">{capitalize(city)}</span>
            </Badge>
        </div>
    );
}
export default memo(CityBadge);