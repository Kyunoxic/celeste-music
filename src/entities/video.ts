export class VideoUtilities {
    static convertToHumanReadbleTime(lengthSeconds: number): string {
        const hours = Math.floor(lengthSeconds / 3600);
        const minutes = Math.floor(lengthSeconds / 60);
        const seconds = lengthSeconds % 60;

        if(hours == 0) {
            return `${minutes < 10 ? `0${minutes}` : minutes}`
                + `:${seconds < 10 ? `0${seconds}` : seconds}`;
        } else {
            return `${hours < 10 ? `0${hours}` : hours}`
                + `${minutes < 10 ? `0${minutes}` : minutes}`
                + `:${seconds < 10 ? `0${seconds}` : seconds}`;
        }
    }
}