export const userSelect = {
    id: true,
    email: true,
    password: true,
    roles: {
        select: {
            roleName: true,
        },
    },
};
