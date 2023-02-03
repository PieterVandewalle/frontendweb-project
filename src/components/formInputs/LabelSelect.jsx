import { Label, Select } from "flowbite-react";
import { memo } from "react";
import { useFormContext } from "react-hook-form";

const LabelSelect = ({ name, label, defaultText, options, validationRules, className }) => {
    const { register, errors, isSubmitting } = useFormContext();
    const hasError = name in errors;

    return (
        <div className={className}>
            <div className="mb-2 block">
                <Label
                    htmlFor={name}
                    value={label}
                />
            </div>
            <Select {...register(name, validationRules)}
                helperText={hasError && <span className="font-semibold text-red-600 p-1">{errors[name].message}</span>}
                disabled={isSubmitting}
            >
                <option value=''>{defaultText}</option>
                {options.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
            </Select>
        </div>);
}

export default memo(LabelSelect);