import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router';

//Alle toasts verwijderen bij veranderen van pagina
const RemoveToasts = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        toast.remove();
    }, [pathname]);

    return null;
}
export default RemoveToasts;