import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

//Automatisch naar boven scrollen bij veranderen van pagina
const ScrollToTop = () => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page");
    const success = searchParams.get("success");
    const { pathname } = useLocation();

    useEffect(() => {
        document.documentElement.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, [pathname, page, success]);
}
export default ScrollToTop;