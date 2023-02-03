import { Auth0Provider } from '@auth0/auth0-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

function MyAuth0Provider({ children }) {
    const navigate = useNavigate();

    const domain = process.env.REACT_APP_AUTH0_DOMAIN;
    const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
    const audience = process.env.REACT_APP_AUTH0_API_AUDIENCE;

    const onRedirectCallback = useCallback((appState) => {
        navigate("/login", { state: { callback: appState && appState.returnTo ? appState.returnTo : window.location.pathname } });
    }, [navigate]);

    return (
        <Auth0Provider
            domain={domain}
            audience={audience}
            clientId={clientId}
            redirectUri={`${window.location.origin}/login`}
            cacheLocation="localstorage"
            onRedirectCallback={onRedirectCallback}
            useRefreshTokens={true}
        >
            {children}
        </Auth0Provider>
    );
}
export default MyAuth0Provider;
