import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import Loader from "../components/Loader";
import LoginButton from "../components/buttons/LoginButton";
import { useUserInfo } from "../contexts/User.context";

//Login flow na redirect omdat user private route wou bereiken 
// 1. Redirect naar /login met location.state.target het pad dat hij wou bereiken vb. /posts/create
// 2. In authlanding wordt gebruiker doorgestuurd naar auth0 login omdat er een target is ingesteld
// 3. Gebruiker wordt teruggestuurd en de onRedirectCallback functie van de Auth0Provider stuurt gebruiker naar /login, deze keer met location.state.callback: /posts/create
// 4. Nadat isAuthenticated = true en profiel van gebruiker is opgehaald wordt gebruiker geredirect naar de location.state.callback
const AuthLanding = () => {
    const { error, isLoading, loginWithRedirect, isAuthenticated } = useAuth0();

    const location = useLocation();
    const target = location.state?.target;
    const callback = location.state?.callback;

    const navigate = useNavigate();

    const { id: userId, error: userInfoError } = useUserInfo();

    useEffect(() => {
        if (!target) return;
        loginWithRedirect({
            appState: {
                returnTo: target
            }
        });
    }, [target, loginWithRedirect, isLoading]);

    // Wordt uitgevoerd nadat user teruggestuurd wordt vanuit login portal, het profiel van de gebruiker moet opgehaald worden voordat hij andere paginas kan bekijken
    // Dit zorgt er ook voor dat de gebruiker geregistreerd wordt indien nodig
    useEffect(() => {
        if (!isAuthenticated || !userId)
            return;
        navigate(callback, { replace: true });
    }, [callback, isAuthenticated, userId, navigate]);

    if (userInfoError) {
        return <Navigate to={callback} replace />;
    }

    if (error) {
        return (<div className="container card mt-8">
            <h1 className="text-lg font-bold">Login failed</h1>
            <p>
                Sorry, we were unable to sign you in, the error below might be useful.
            </p>
            <div className="font-semibold text-red-600">{error?.message}</div>
            <LoginButton />
        </div>);
    }

    if (target) {
        return (<div className="container card mt-8">
            <Loader loadingText="Redirecting you to the login page" />
        </div>);
    }

    if (!target && !callback && !isLoading) {
        return <Navigate to="/" />;
    }

    return (
        <div className="container card mt-8">
            <Loader loadingText="Signing in" />
            <p>Please wait while we sign you in...</p>
        </div>
    );




}

export default AuthLanding;