import { useState } from "react";

export const useLoader = () => {

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    return {
        setMessage,
        setOpen,
        message,
        open
    }
}