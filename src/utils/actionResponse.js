export const errorMessage = (message, data) => {
    return {
        message: message,
        type: "error",
        data: data ?? undefined,
    };
};
export const successMessage = (message, data) => {
    return {
        message: message,
        type: "success",
        data: data ?? undefined,
    };
};