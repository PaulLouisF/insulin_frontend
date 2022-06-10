export const transformDateLong = (date: string) => {
    const formatedDate = new Date(date);
    return formatedDate.toLocaleDateString("fr-FR", { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
};

export const transformDateShort = (date: string) => {
    const formatedDate = new Date(date);
    return formatedDate.toLocaleDateString("fr-FR");
};

export const transformDateShortWithTime = (date: string) => {
    const formatedDate = new Date(date);
    return formatedDate.toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
};

export const calculateTimeInMinutes = (date: string) => {
    const duration = (Date.now() - new Date(date).getTime())/(1000* 60)
    return duration.toFixed(0);
};
