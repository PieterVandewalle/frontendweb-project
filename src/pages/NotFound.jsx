import notFoundIllustration from "../images/notFound.svg";

const NotFound = () => {
    return (
        <div className="card md:gap-8 md:flex-row flex-wrap items-center justify-center">
            <div className="flex flex-col text-center gap-5 md:gap-10 items-center">
                <h5 className="text-5xl md:text-9xl font-semibold tracking-tight text-primary">404</h5>
                <h5 className="text-lg md:text-5xl font-semibold tracking-tight text-primary-700">Oooops, page not found.</h5>
            </div>
            <img className="max-w-96 max-h-96" src={notFoundIllustration} alt="Not found"></img>
        </div>
    );
}

export default NotFound;