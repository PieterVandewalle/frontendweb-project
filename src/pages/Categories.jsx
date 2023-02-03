import { Link } from "react-router-dom";
import formatTitleForUrl from "../utils/formatTitleForUrl";
import { useGetCategories } from "../hooks/useGetCategories";
import LoadingWrapper from "../components/LoadingWrapper";

const CategoryCard = ({ id, name, imageUrl }) => {
    return (
        <Link to={`${id}/${formatTitleForUrl(name)}`} data-cy={`cat_${name.toLowerCase().replace(" ", "_")}_btn`}>
            <div className="flex flex-col justify-between w-80 h-64 bg-white border border-gray-200 rounded-lg shadow-md hover:opacity-90 group">
                <img className="rounded-t-lg w-full h-2/3 bg-contain" src={imageUrl} alt={name} />
                <h5 className="p-5 text-2xl font-bold text-gray-800 tracking-tight group-hover:text-primary ">{name}</h5>
            </div>
        </Link>
    );
}

const Categories = () => {
    const { data, isLoading, error, isRefetching } = useGetCategories();
    const categories = data || [];

    return (
        <LoadingWrapper isRefetching={isRefetching} isLoading={isLoading} error={error} loadingText={"Loading Categories"}>
            <div className="container gap-5 mx-auto flex flex-row flex-wrap  justify-center">
                {categories.map((category) => <CategoryCard key={category.id} id={category.id} name={category.name} imageUrl={category.imageUrl} />)}
            </div>
        </LoadingWrapper>
    )
}

export default Categories;