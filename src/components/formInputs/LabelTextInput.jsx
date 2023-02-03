import { Label, TextInput } from "flowbite-react";
import { memo } from "react";
import { useFormContext } from "react-hook-form";

const LabelTextInput = ({ label, name, type, validationRules, className, showHelperText = true, ...rest }) => {
    const { register, errors, isSubmitting } = useFormContext();
    const hasError = name in errors;
    return (
        <div className={className}>
            <div className="mb-2 block">
                <Label htmlFor={name} value={label} />
            </div>
            <TextInput {...register(name, validationRules)} disabled={isSubmitting} type={type} sizing="md" helperText={showHelperText && hasError && <span className="font-semibold text-red-600">{errors[name].message}</span>} {...rest} />
        </div>
    );

}
export default memo(LabelTextInput);