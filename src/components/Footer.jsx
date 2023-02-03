import { Footer } from "flowbite-react";
import { memo } from "react";
import { BsGithub } from "react-icons/bs";
import logoT from "../images/logoT.png";

const MyFooter = () => {
    return (<div className="mt-auto">
        <Footer container={true}>
            <div className="container mx-auto">
                <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
                    <div className="mb-3 md:mb-0">
                        <Footer.Brand
                            href="/"
                            src={logoT}
                            alt="TweedehandsTech Logo"
                            name="TweedehandsTech"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:mt-4  sm:gap-6">
                        <div>
                            <Footer.Title title="This Project" />
                            <Footer.LinkGroup col={true}>
                                <Footer.Link href="https://github.com/Web-IV/2223-frontendweb-PieterVandewalle">
                                    Github Front-end
                                </Footer.Link>
                                <Footer.Link href="https://github.com/Web-IV/2223-webservices-PieterVandewalle">
                                    Github Back-end
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Front-end tech" />
                            <Footer.LinkGroup col={true}>
                                <Footer.Link href="https://tailwindcss.com/">
                                    Tailwind CSS
                                </Footer.Link>
                                <Footer.Link href="https://flowbite-react.com/">
                                    Flowbite React
                                </Footer.Link>
                                <Footer.Link href="https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/">
                                    React Query
                                </Footer.Link>
                                <Footer.Link href="https://react-hot-toast.com/">
                                    React-hot-toast
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright
                        by="TweedehandsTech™ - Pieter Vandewalle"
                        year={2022}
                    />
                    <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                        <Footer.Icon
                            href="https://github.com/PieterVandewalle"
                            icon={BsGithub}
                        />
                    </div>
                </div>
            </div>
        </Footer></div>
    );
}

export default memo(MyFooter);