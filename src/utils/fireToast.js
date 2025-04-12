import {toast} from "react-toastify";

const options = {
    position: "top-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    rtl: false,
};

const fireToast = (type, text = "", closeAfter = 5000, textPosition = "top-right") => {
    let toastOptions = {
        ...options,
        position: textPosition,
        closeAfter: closeAfter,
    };
    let firedToast;

    switch (type) {
        case "info":
            firedToast = toast.info(text, toastOptions);
            break;
        case "success":
            firedToast = toast.success(text, toastOptions);
            break;
        case "warning":
            firedToast = toast.warning(text, toastOptions);
            break;
        case "error":
            firedToast = toast.error(text, toastOptions);
            break;
        case "loading":
            firedToast = toast.loading(text, {
                ...toastOptions,
                isLoading: true,
                autoClose: false,
            });
            break;
        case "default":
            firedToast = toast(text, toastOptions);
            break;
    }
    return firedToast;
};

export const promiseToast = async (fn, pendingMsg = "Prebieha akcia...", successMsg = "Akcia prebehla úspešne!", errorMsg = "Pri vykonávaní akcie došlo ku chybe! Kontaktujte prosím administrátora.") => {
    return await toast.promise(
        fn,
        {
            pending: pendingMsg,
            success: successMsg,
            error: errorMsg,
        },
        options,
    );
};

export default fireToast;
