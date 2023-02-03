const formatTitleForUrl = (title) => {
    return title && title.replaceAll(new RegExp("[^A-Za-z0-9]+", "g"), "-");
}
export default formatTitleForUrl;