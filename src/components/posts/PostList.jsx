import { Button } from "flowbite-react";
import PostListItem from "./PostListItem";
import { useSearchParams } from "react-router-dom";
import { memo, useCallback } from "react";
import { useEffect } from "react";

const NextButton = memo(function NextButton({ hasNext, isPreviousData, onClick }) {
    return (
        <Button color={"light"} disabled={!hasNext || isPreviousData} onClick={onClick} className="w-24" data-cy="next_page_btn">
            Next
            <svg aria-hidden="true" className="max-w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </Button>
    );
});

const PreviousButton = memo(function PreviousButton({ page, onClick }) {
    return (
        <Button color={"light"} disabled={page === 1} onClick={onClick} className="w-24">
            <svg aria-hidden="true" className="max-w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path></svg>
            Previous
        </Button>
    );
});

const PostList = ({ posts, isPreviousData, hasNext, canEdit, onDelete, onFavorite }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page")) || 1;

    const changePage = useCallback((newPage) => {
        setSearchParams(prevSearchParams => {
            if (prevSearchParams.get("page")) {
                newPage === 1 ? prevSearchParams.delete("page") : prevSearchParams.set("page", newPage);
            } else {
                prevSearchParams.set("page", 2);
            }
            return prevSearchParams;
        });
    }, [setSearchParams]);

    const next = useCallback(() => (!isPreviousData && hasNext) && changePage(page + 1), [changePage, isPreviousData, hasNext, page]);
    const previous = useCallback(() => page !== 1 && changePage(page - 1), [changePage, page]);

    useEffect(() => {
        if (page !== 1 && posts.length === 0) {
            previous();
        }
    }, [page, posts.length, previous]);

    if (!posts)
        return;

    if (!isPreviousData && posts.length === 0) {
        return <div className="card font-semibold" data-cy="no_posts_yet">No posts yet...</div>
    }

    return (<>
        <div className="flex flex-col gap-5">
            {posts.map(post => {
                const { id, title, price, description, date, city, deliveryType: { name: deliveryType }, image, favorite } = post;
                const imageUrl = image?.url;
                return <PostListItem key={post.id} canEdit={canEdit} id={id} date={date} title={title} price={price} description={description} city={city} deliveryType={deliveryType} imageUrl={imageUrl} favorite={favorite} onDelete={onDelete} onFavorite={onFavorite} />;
            })}
            {posts.length !== 0 ?
                <div className="mt-5 w-full flex items-center gap-2 justify-center">
                    <PreviousButton onClick={previous} page={page} />
                    <NextButton onClick={next} hasNext={hasNext} isPreviousData={isPreviousData} />
                </div>
                :
                null
            }
        </div> </>
    );
}

export default memo(PostList);