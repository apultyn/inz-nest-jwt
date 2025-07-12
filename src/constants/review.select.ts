export const reviewSelect = {
    id: true,
    comment: true,
    stars: true,
    user: {
        select: {
            email: true,
        },
    },
};
