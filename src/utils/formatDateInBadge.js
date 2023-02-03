export const formatDateInBadge = (date) => {
    const now = new Date();
    const diff = Math.floor(now.getTime() - new Date(date).getTime());
    const hour = 1000 * 60 * 60;
    const day = hour * 24;
    const days = Math.floor(diff / day);
    const months = Math.floor(days / 31);
    const years = Math.floor(months / 12);
    const hours = Math.floor(diff / hour);

    if (years >= 1)
        return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months >= 1)
        return `${months} month${months > 1 ? "s" : ""} ago`;
    if (days >= 1)
        return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours >= 1)
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Less than 1 hour ago";
}