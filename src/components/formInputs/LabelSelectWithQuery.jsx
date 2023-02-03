import { Label, Select } from "flowbite-react";
import { memo } from "react";
import { useFormContext } from "react-hook-form";

const LabelSelectWithQuery = ({ name, label, labelPlural, defaultText, useGetOptionsQuery, validationRules, className, ...rest }) => {
    const { register, errors, isSubmitting } = useFormContext();

    const { isLoading, isSuccess, data, error } = useGetOptionsQuery();
    const hasError = name in errors;

    //Doordat de options worden opgehaald in een query geeft dit problemen als register gebeurt voordat de options er zijn (defaultValue wordt niet correct ingesteld), 
    //oplossing: formfield registeren nadat options geladen zijn
    return (
        <div className={className}>
            <div className="mb-2 block">
                <Label
                    htmlFor={name}
                    value={label}
                />
            </div>
            {!isSuccess ?
                <Select><option value=''>{isLoading ? `Loading ${labelPlural}... ` : (error?.message || defaultText)}</option></Select>
                :
                <Select {...register(name, validationRules)}
                    helperText={hasError && <span className="font-semibold text-red-600 p-1">{errors[name].message}</span>}
                    disabled={isLoading || error || isSubmitting}
                    {...rest}
                >
                    <option value=''>{defaultText}</option>
                    {isSuccess && data.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
                </Select>}
        </div>);
}

export default memo(LabelSelectWithQuery);