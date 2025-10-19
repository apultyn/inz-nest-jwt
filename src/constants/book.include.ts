export const bookInclude = {
    reviews: {
        select: {
            id: true,
            comment: true,
            stars: true,
            bookId: true,
            user: {
                select: {
                    email: true,
                },
            },
        },
    },
};
