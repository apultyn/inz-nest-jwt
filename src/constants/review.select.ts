export const reviewSelect = {
    id: true,
    comment: true,
    stars: true,
    bookId: true,
    user: {
        select: {
            email: true,
        },
    },
};
