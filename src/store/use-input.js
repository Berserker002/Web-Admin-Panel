import { useState } from "react";

const useInput = (validity) => {
    const [enteredInput, setEnteredInput] = useState('');
    const [wasTouched, setWasTouched] = useState(false);

    const inputIsValid = validity(enteredInput);
    const inputIsInValid = !inputIsValid && wasTouched;


    const enteredInputHandler = (event) => {
        setEnteredInput(event.target.value);       
    }

    const inputLostFocusHandler = () => {
        setWasTouched(true);
    }

    const reset = () => {
        setEnteredInput('')
        setWasTouched(false);
    }

    return {
        enteredInput,
        inputIsValid,
        inputIsInValid,
        setWasTouched,
        enteredInputHandler,
        inputLostFocusHandler,
        setEnteredInput,
        reset
    }

};

export default useInput;