export function dateConvert(timestamp) {
    const date = new Date(timestamp);
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}

export function twelveHourTimeFormat(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // 0 -> 12
    minutes = minutes.toString().padStart(2, '0');

    return `${hours}:${minutes} ${ampm}`;
}
