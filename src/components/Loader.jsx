import { Spinner } from "flowbite-react"
import { memo } from "react"

const Loader = ({ loadingText }) => {
    return <div className="flex gap-4 items-center text-primary font-semibold"><Spinner size={"lg"} />{loadingText}</div>
}
export default memo(Loader);

