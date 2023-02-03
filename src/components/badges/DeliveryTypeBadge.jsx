import { Badge } from "flowbite-react";
import { memo } from "react";
import { TbTruckDelivery } from "react-icons/tb";

const DeliveryTypeBadge = ({ deliveryType, inList = false, ...rest }) => {
    return (
        <div className={`w-max ${inList ? 'hidden sm:block' : null}`}>
            <Badge
                icon={TbTruckDelivery}
            >
                <span data-cy="post_deliveryType">{deliveryType}</span>
            </Badge>
        </div>
    );
}
export default memo(DeliveryTypeBadge);