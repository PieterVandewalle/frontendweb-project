import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "flowbite-react";
import { memo, useCallback } from "react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    const handleLogin = useCallback(async () => {
        loginWithRedirect({
            appState: {
                returnTo: window.location.pathname
            }
        });
    }, [loginWithRedirect]);

    return <Button size="sm" onClick={handleLogin}>Sign in</Button>;
}

export default memo(LoginButton);