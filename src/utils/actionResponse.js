export const errorMessage = (message)  => {
    return {
        message: message,
        type: "error",
    };
};

export const infoMessage = (message, data) => {
    return {
        message: message,
        type: "info",
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