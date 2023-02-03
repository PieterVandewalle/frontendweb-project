import { Button, Label, Select } from "flowbite-react";
import { memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { HiAdjustments } from "react-icons/hi";
import { TbRefresh } from "react-icons/tb";
import { useSearchParams } from "react-router-dom";
import { useGetDeliveryTypes } from "../../hooks/useGetDeliveryTypes";
import LabelTextInput from "../formInputs/LabelTextInput";

const LabelSelectSearchParamAsync = ({ name, label, labelPlural, query, defaultText, className, ...rest }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isLoading, isSuccess, data, error } = query();
    const value = searchParams.get(name) || defaultText;

    const handleChange = useCallback((e) => {
        setSearchParams(prevSearchParams => {
            e.target.value === "" ? prevSearchParams.delete(name) : prevSearchParams.set(name, e.target.value);
            prevSearchParams.delete("page");
            return prevSearchParams;
        });
    }, [setSearchParams, name]);

    return (
        <div className={className}>
            <div className="mb-2 block">
                <Label htmlFor={name} value={label} />
            </div>
            <Select
                id={name}
                disabled={isLoading || error}
                onChange={handleChange}
                value={value}
                {...rest}
            >
                <option value="">{isLoading ? `Loading ${labelPlural}... ` : (error?.message || defaultText)}</option>
                {isSuccess && data.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
            </Select>
        </div>);
}
const LabelSelectSearchParam = ({ name, label, options, defaultText, className, ...rest }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleChange = useCallback((e) => {
        setSearchParams(prevSearchParams => {
            e.target.value === "" ? prevSearchParams.delete(name) : prevSearchParams.set(name, e.target.value);
            prevSearchParams.delete("page");
            return prevSearchParams;
        });
    }, [setSearchParams, name]);

    return (
        <div className={className}>
            <div className="mb-2 block">
                <Label htmlFor={name} value={label} />
            </div>
            <Select
                id={name}
                onChange={handleChange}
                value={searchParams.get(name) || defaultText}
                {...rest}
            >
                <option value="">{defaultText}</option>
                {options.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
            </Select>
        </div>);
}

const FilterError = memo(function FilterError({ minPriceError, maxPriceError }) {
    return (
        <div className="font-semibold text-red-600 w-full mt-1" data-cy="price_filter_error">
            <div>{minPriceError ? minPriceError : null}</div>
            <div>{maxPriceError ? maxPriceError : null}</div>
        </div>
    );
});

const orderOptions = [
    { id: "date-asc", name: "Date (Old- New)" },
    { id: "price-desc", name: "Price (Descending)" },
    { id: "price-asc", name: "Price (Ascending)" },
];

const PostListFilter = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const { register, handleSubmit, reset: resetPriceFilter, setValue, getValues, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            minPrice: searchParams.get("minPrice"),
            maxPrice: searchParams.get("maxPrice")
        }
    });

    const validationRules = {
        minPrice: {
            valueAsNumber: true,
            min: { value: 0, message: "Please provide a valid price" },
        },
        maxPrice: {
            valueAsNumber: true,
            min: { value: 0, message: "Max price should be higher than 0" },
            validate: {
                isHigherThanMinPrice: (value) => {
                    if (isNaN(value)) {
                        return;
                    }
                    return (value >= (parseInt(getValues("minPrice")) || 0)) || "Max price should be higher than min price"
                }
            }
        }
    };

    const resetFilters = () => {
        setSearchParams(prevSearchParams => {
            //Als er een filter werd ingesteld -> terug naar pagina 1 want er zijn andere resultaten
            if ([...prevSearchParams.keys()].find(key => ["page", "searchterm"].includes(key)))
                prevSearchParams.delete("page");

            ["minPrice", "maxPrice", "deliveryTypeId", "order"].forEach(key => prevSearchParams.delete(key));
            return prevSearchParams;
        });
        resetPriceFilter();
    }


    const refreshPrice = (data) => {
        const { minPrice, maxPrice } = data;
        setSearchParams(prevSearchParams => {
            minPrice >= 0 && minPrice != null ? prevSearchParams.set("minPrice", minPrice) : prevSearchParams.delete("minPrice");
            maxPrice >= 0 && maxPrice != null ? prevSearchParams.set("maxPrice", maxPrice) : prevSearchParams.delete("maxPrice");
            prevSearchParams.delete("page");
            return prevSearchParams;
        });
    }


    const toggleFilters = useCallback(() => setShowFilters(prevShowFilters => !prevShowFilters), []);
    return (<>
        <Button color="gray" className="md:hidden w-full" size={"sm"} onClick={toggleFilters}>
            <HiAdjustments className="mr-3 h-4 w-4" />
            {" "}{showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        <div className={`md:flex flex-row flex-wrap gap-3 lg:gap-8 items-end  ${showFilters ? "flex" : "hidden"}`}>
            <FormProvider handleSubmit={handleSubmit} register={register} setValue={setValue} errors={errors} isSubmitting={isSubmitting}>
                <form className="flex flex-wrap items-end gap-3" onSubmit={handleSubmit(refreshPrice)}>
                    <LabelTextInput label="Minimum Price" name="minPrice" type="number" className="w-28" placeholder="min" min={0} step="0.01" validationRules={validationRules["minPrice"]} showHelperText={false} data-cy="posts_minPrice_input" />
                    <LabelTextInput label="Maximum Price" name="maxPrice" type="number" className="w-28" placeholder="max" min={0} step="0.01" validationRules={validationRules["maxPrice"]} showHelperText={false} data-cy="posts_maxPrice_input" />
                    <Button color="light" size="md" type="submit" disabled={isSubmitting} data-cy="submit_price_filter"><span className="sm:hidden mr-2">Apply Price</span><TbRefresh size={20} /></Button>
                </form>
            </FormProvider>

            <LabelSelectSearchParamAsync name="deliveryTypeId" label="Delivery type" labelPlural="delivery types" query={useGetDeliveryTypes} defaultText="All delivery types" className="w-44" data-cy="posts_deliveryType_input" />
            <LabelSelectSearchParam name="order" label="Order by" options={orderOptions} defaultText={`Date (New - Old)`} className="w-44" data-cy="posts_order_input" />
            <Button color={"light"} onClick={resetFilters} data-cy="reset_filters_btn">Reset Filters</Button>
        </div>
        <FilterError minPriceError={errors.minPrice?.message} maxPriceError={errors.maxPrice?.message} />
    </>);
}

export default memo(PostListFilter);