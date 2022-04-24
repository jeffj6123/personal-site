const msDurations = 1000;
const secDuration = 60 * msDurations;
const minuteDuration = secDuration * 60;
const hoursDuration = minuteDuration * 60;
const daysDuration = hoursDuration * 24;
const yearsDuration = 365 * daysDuration;

export function formatDuration(duration: number): string {
    const milliseconds = duration % 1000;
    const seconds = duration / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const years = days / 365;


    if (duration < msDurations) {
        return `${milliseconds} milliseconds`;
    }

    if (duration < secDuration) {
        return `${seconds} seconds`;
    }


    if (duration < minuteDuration) {
        return `${formatIndividualTime(minutes % 60, 0)}:`
            + `${formatIndividualTime(seconds % 60, 2, 2)} minutes`;
    }

    if (duration < hoursDuration) {
        return `${Math.floor(hours % 24)}:`
            + `${formatIndividualTime(minutes % 60)}:`
            + `${formatIndividualTime(seconds % 60, 2, 2)}`
            + ` hours`;
    }

    return `${Math.floor(days) > 0 ? Math.floor(days) + ' days ' : ''}`
        + `${formatIndividualTime(hours % 24)}:`
        + `${formatIndividualTime(minutes % 60)}:`
        + `${formatIndividualTime(seconds % 60, 2, 2)}`;
}

export function formatIndividualTime(duration: number, padStart = 2, substringSize: number = 0) {
    let floored = Math.floor(duration).toString();
    if (substringSize > 0) {
        floored = floored.substring(0, substringSize);
    }
    return floored.padStart(padStart, '0');
}