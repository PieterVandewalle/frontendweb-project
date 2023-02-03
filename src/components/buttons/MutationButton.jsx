import { Button, Spinner } from "flowbite-react";
import { memo } from "react"

//Button wordt gebruik bij uitvoeren van een mutation (vb. post opslaan, bericht verzenden, ..)
//Hierbij moet loading getoond worden tijdens het uitvoeren van de api call(s)
const MutationButton = ({ isMutating, normalText, mutatingText, ...buttonProps }) => {
    return (
        <Button disabled={isMutating} {...buttonProps}>
            {isMutating ?
                <span className="mr-3">
                    <Spinner
                        size="sm"
                        light={true}
                    /></span>
                : null}
            {isMutating ? mutatingText : normalText}
        </Button>);
}

export default memo(MutationButton);