const NUMBER_OF_POSTS_PER_PAGE = 5;

const pageToOffset = (page) => {
    return page ? (parseInt(page) - 1) * NUMBER_OF_POSTS_PER_PAGE : 0;
}

export default pageToOffset;