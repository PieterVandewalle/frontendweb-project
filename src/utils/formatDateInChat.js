const dateFormatToday = new Intl.DateTimeFormat("nl-BE", {
    hour: "2-digit",
    minute: "2-digit"
});

const dateFormat = new Intl.DateTimeFormat("nl-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
});

export const formatDateInChat = (date) => new Date().toDateString() === date.toDateString() ? dateFormatToday.format(date) : dateFormat.format(date);