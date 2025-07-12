export const bookInclude = {
    reviews: {
        select: {
            id: true,
            comment: true,
            stars: true,
            user: {
                select: {
                    email: true,
                },
            },
        },
    },
};
