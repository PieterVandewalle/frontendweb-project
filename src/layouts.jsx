import { Outlet } from "react-router";
import Nav from "./components/Nav";
import MyFooter from "./components/Footer";
const NavLayout = () => {
    return (<div className="flex flex-col min-h-screen bg-[#EDEDED] m-0 p-0 gap-4">
        <Nav />
        <div className="min-h-screen mb-11 px-2">
            <Outlet />
        </div>
        <MyFooter />
    </div>);
}

const OnlyContentLayout = () => {
    return (<div className="flex flex-col min-h-screen bg-[#EDEDED] m-0 p-0 gap-4">
        <div className="min-h-screen px-2">
            <Outlet />
        </div>
    </div>);
}
export { NavLayout, OnlyContentLayout };