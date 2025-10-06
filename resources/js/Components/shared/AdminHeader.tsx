import { Dialog, Menu, Transition } from "@headlessui/react";
import { Bars3CenterLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon, ChevronUpIcon, BellIcon } from "@heroicons/react/24/outline";
import { Fragment, ReactNode, useState } from "react";
import Breadcrumbs from "../elements/header/BreadCumbs";
import { Link } from "@inertiajs/react";
import SideNavLinks from "@/lib/SideNavLinks";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

const AdminHeader = ({
    user,
    header,
    bRoutes,
}: {
    user: any;
    header?: ReactNode;
    bRoutes?: any[];
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [Dropdown, setDropdown] = useState(false);

    return (
        <>
            {/* Mobile Sidebar */}
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[101] lg:hidden" onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-opacity-75 bg-slate-900" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-50 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-slate-200">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 pt-2 -mr-12">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>

                                {/* Sidebar navigation */}
                                <nav className="flex-shrink-0 h-screen pb-10 mt-5 overflow-y-auto">
                                    <div className="flex items-center justify-center">
                                        <img className="h-10 mx-auto" alt="site logo" />
                                    </div>
                                    <div className="flex flex-col px-8 py-3 mt-4 space-x-2 bg-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center justify-start px-4 space-x-2">
                                                {/* <img
                                                    className="object-cover w-10 h-10 rounded-full"
                                                    src={user?.avatar ?? "/assets/images/avatars/user.png"}
                                                /> */}
                                                <p className="text-sm font-medium ">{user?.full_name}</p>
                                            </div>
                                            <div>
                                                {Dropdown ? (
                                                    <ChevronDownIcon className="w-4 h-4" onClick={() => setDropdown(false)} />
                                                ) : (
                                                    <ChevronUpIcon className="w-4 h-4" onClick={() => setDropdown(true)} />
                                                )}
                                            </div>
                                        </div>

                                        {Dropdown && (
                                            <div className="px-12 space-y-1">
                                                <Link
                                                    href={route("logout")}
                                                    method={"post"}
                                                    as="button"
                                                    type="button"
                                                    className="block w-full px-4 py-2 text-sm text-left text-gray-700"
                                                >
                                                    Logout
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-2 mt-4 space-y-1">
                                        <SideNavLinks />
                                    </div>
                                </nav>
                            </Dialog.Panel>
                        </Transition.Child>
                        <div className="flex-shrink-0 w-14" aria-hidden="true" />
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Desktop Header */}
            <div className="lg:pt-4 lg:mt-0 lg:px-3 relative lg:fixed bg-slate-900 lg:bg-gradient-to-r lg:from-slate-200 lg:to-slate-100 top-0 left-0 right-0 z-50 backdrop-blur-[6px]">
                <header className="flex z-50 lg:h-[4.3rem] w-full flex-shrink-0 bg-slate-900 lg:rounded-xl items-center justify-between px-4 lg:px-8">
                    {/* Left: Logo + Sidebar Toggle */}
                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-transparent lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Bars3CenterLeftIcon className="w-6 h-6 text-slate-200" />
                        </button>
                        {/* <img
                            className="h-[50px] object-contain"
                            src={"/assets/images/ai-geeks.png"}
                            alt="site logo"
                        /> */}
                    </div>

                    {/* Center: Search Bar */}
                    <div className="flex-1 mx-4">
                        <input
                            type="text"
                            placeholder="Search product, supplier, order"
                            className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Right: Notification + User */}
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 rounded-full hover:bg-slate-700">
                            <BellIcon className="w-6 h-6 text-white" />
                            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-transparent">
                                {/* <img
                                    className="object-cover w-10 h-10 rounded-full"
                                    src={user?.avatar ?? "/assets/images/avatars/user.png"}
                                /> */}
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 w-48 py-1 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href={route("logout")}
                                                method={"post"}
                                                as="button"
                                                type="button"
                                                className={classNames(
                                                    active ? "bg-gray-100" : "",
                                                    "block w-full px-4 py-2 text-left text-sm text-gray-700"
                                                )}
                                            >
                                                Logout
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </header>

                {/* Breadcrumbs */}
                {bRoutes && bRoutes.length > 0 && (
                    <div className="hidden lg:flex px-8 py-2 bg-slate-100">
                        <Breadcrumbs routes={bRoutes} />
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminHeader;
