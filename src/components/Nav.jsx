import { Avatar, Dropdown, } from "flowbite-react";
import { memo, useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetCategories } from "../hooks/useGetCategories";
import formatTitleForUrl from "../utils/formatTitleForUrl";
import logoT from "../images/logoT.png";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserInfo } from "../contexts/User.context";
import { BiCategory, BiPlus } from "react-icons/bi";
import LoginButton from "./buttons/LoginButton";

const SearchbarWithCategory = () => {
    const navigate = useNavigate();
    const [searchterm, setSearchterm] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState();
    const { categoryId } = useParams();

    const { isLoading, data: categories, error } = useGetCategories({
        onSuccess: (data) => {
            setSelectedCategory(categoryId ? data.find(c => c.id === parseInt(categoryId)) : null);
        }
    });

    const handleSelectedCategoryChange = useCallback((category) => {
        setDropdownOpen(false);
        setSelectedCategory(category);
    }, []);

    const resetSelectedCategory = useCallback(() => handleSelectedCategoryChange(null), [handleSelectedCategoryChange]);

    const search = useCallback(() => {
        navigate(`${selectedCategory ? `/categories/${selectedCategory.id}/${formatTitleForUrl(selectedCategory.name)}` : "/posts"}?searchterm=${searchterm}`);
        setSearchterm("");
    }, [navigate, searchterm, selectedCategory]);

    const dropdownTitle = isLoading ? "Loading..." : error ? "Loading Error" : selectedCategory ? selectedCategory.name : "All categories";

    const handleSearchtermChange = useCallback((e) => {
        setSearchterm(e.target.value);
    }, []);

    const handleSearchInputKeyPress = useCallback((e) => (e.key === "Enter") && search(), [search]);

    return (
        <div className="flex">
            <button id="dropdown-button" disabled={error || !categories} onClick={() => setDropdownOpen(!dropdownOpen)} className="flex-shrink-0 z-10 inline-flex items-center justify-between py-2.5 px-1 md:px-4 w-32 md:w-44 text-xs md:text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300  rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">{dropdownTitle}<svg transform={dropdownOpen ? "scale(1 -1)" : ""} aria-hidden="true" className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg></button>
            {dropdownOpen ?
                <div id="dropdown" className="absolute translate-y-12 overflow-y-scroll sm:myScrollbar z-50 w-auto sm:w-44 max-h-52 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 ">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                        {selectedCategory && <li><button className="block py-2 px-3 sm:px-4 text-left w-full hover:bg-gray-100 dark:hover:bg-gray-600" onClick={resetSelectedCategory}>All categories</button></li>}
                        {categories.map(category => <li key={category.id}><button className="block py-2 px-3 sm:px-4 text-left w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSelectedCategoryChange(category)}>{category.name}</button></li>)}
                    </ul>
                </div>
                : null}
            <div className="relative w-full">
                <input type="search" id="search-dropdown" value={searchterm} onChange={handleSearchtermChange} onKeyPress={handleSearchInputKeyPress} className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Find PC's, Graphics cards..." required />
                <button onClick={search} className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "><svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>
            </div>
        </div>
    );
}

const UserDropdown = memo(function UserDropdown({ username, picture, email, onLogout }) {
    return (
        <Dropdown
            arrowIcon={false}
            inline={true}
            label={<Avatar alt="User settings" img={picture} rounded={true} data-cy="user_dropdown_btn" />}
        >
            <Dropdown.Header>
                <span className="block text-sm">
                    {username}
                </span>
                <span className="block truncate text-sm font-medium">
                    {email}
                </span>
            </Dropdown.Header>
            <Link to={"/my-account/posts"}>
                <Dropdown.Item>
                    My Posts
                </Dropdown.Item>
            </Link>
            <Link to={"/my-account/favorites"}>
                <Dropdown.Item>
                    My Favorites
                </Dropdown.Item>
            </Link>
            <Link to={"/my-account/conversations"}>
                <Dropdown.Item>
                    Conversations
                </Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={onLogout}>
                <span data-cy="logout_btn">Sign out</span>
            </Dropdown.Item>
        </Dropdown>
    );
});

const Nav = () => {
    const { user, isAuthenticated, logout } = useAuth0();
    const { username } = useUserInfo();
    const [open, setOpen] = useState(false);

    const toggleNav = useCallback(() => setOpen(open => !open), []);
    const handleLogout = useCallback(() => logout({ returnTo: window.location.origin }), [logout]);

    return (
        <div className="bg-white bg-opacity-95 border-b-gray-200 shadow-sm shadow-primary-100">
            <nav className="container mx-auto bg-white border-gray-200 px-2 sm:px-0 py-2.5 rounded">
                <div className="flex flex-wrap gap-1 sm:gap-2 sm:justify-between w-full mx-auto md:mx-0 md:items-center ">
                    <Link to={"/"} className="flex items-center mr-auto sm:mr-2">
                        <img src={logoT} className="h-6 mr-1 sm:mr-3 sm:h-9" alt="logo" />
                        <span className="self-center text-base sm:text-xl font-semibold whitespace-nowrap">TweedehandsTech</span>
                    </Link>

                    <div className="flex order-2">
                        <button onClick={toggleNav} opentype="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ">
                            <span className="sr-only">Open menu</span>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                    <div className={`w-full lg:w-auto lg:flex-grow lg:order-1 order-4 ${!open && "hidden md:block"}`}><SearchbarWithCategory /></div>
                    <div className={`items-center justify-between w-full ml-auto md:w-auto md:flex order-3 md:order-2 ${!open && "hidden md:block"}`}>
                        <ul className="flex flex-col order-2 p-2 border border-gray-100 bg-gray-50 rounded-lg md:flex-row md:space-x-4 md:text-sm md:font-medium md:border-0 md:bg-white">
                            <li className="block py-2 pl-3 pr-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
                                <Link to={"/categories"}><span className="flex gap-2 items-center"><BiCategory size={18} />Categories</span></Link>
                            </li>
                            <li className="block py-2 pl-3 pr-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
                                <Link to={"/posts/create"}><span className="flex gap-2 items-center"><BiPlus size={18} />New Post</span></Link>
                            </li>
                        </ul>
                    </div>
                    <div className="md:order-3 order-1 md:ml-0 sm:pl-2 text-primary">
                        {isAuthenticated ?
                            <UserDropdown username={username} email={user.email} picture={user.picture} onLogout={handleLogout} />
                            :
                            <LoginButton />
                        }</div>
                </div>
            </nav >
        </div >
    );
}
export default memo(Nav);