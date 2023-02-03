import { Spinner } from "flowbite-react";
import { memo } from "react";
import { BiErrorCircle } from "react-icons/bi";
import Loader from "./Loader";
// 1 - isLoading (= if there's no cached data and no query attempt was finished yet.)
// isRefetching = true whenever a background refetch is in-flight, which does not include initial loading
// Bij loading tonen we een loading card
// Bij error tonen we de errormessage
// Indien visibleRefetch=true => bij refetch opacity verminderen en spinner bovenop container tonen

const LoadingWrapper = ({ isLoading, error, loadingText, isRefetching, children, visibleRefetch = true }) => {
    if (isLoading)
        return <div className="card" data-cy="loading"><Loader loadingText={loadingText} /></div>;

    if (error && !isRefetching) {
        return (
            <div className="card" data-cy="error_loading">
                <div className="flex items-center gap-2 text-red-600 font-semibold"><BiErrorCircle size={30} />{`An error occurred: ${error.message}`}</div>
            </div >
        );
    }

    return (
        <div className="relative">
            {isRefetching && visibleRefetch && <div className="absolute top-48 left-1/2 transform -translate-x-1/2 z-50"><Spinner size={"lg"} /></div>}
            <div className={`${isRefetching && visibleRefetch ? "opacity-20" : ""} transition-opacity`}>
                {children}
            </div>
        </div>
    );
}

export default memo(LoadingWrapper);