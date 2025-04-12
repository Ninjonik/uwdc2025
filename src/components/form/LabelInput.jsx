import React from 'react';

const LabelInput = ({
    labelClassName = "input",
    svgClassName = "h-[1em] opacity-50",
    inputClassName = "grow",
    placeholder = "index.php",
    svgIcon,
    ...inputProps
}) => {
    return (
        <label className={`${labelClassName} flex flex-row gap-2 items-center input`}>
            {svgIcon && <span className={svgClassName}>{svgIcon}</span>}
            <input
                type="text"
                className={inputClassName}
                placeholder={placeholder}
                {...inputProps}
            />
        </label>
    );
};

export default LabelInput;
