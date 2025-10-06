import { Link, usePage } from "@inertiajs/react";
import DynamicHeroIcon from "@/Components/elements/icons/DynamicHeroIcon";
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function NavSingle({
    startWith,
    routeName,
    name,
    icon,
    count,
}: {
    startWith?: string;
    routeName?: any;
    name: any;
    icon: any;
    count: any;
}) {
    const { url } = usePage();

    function isActive(startWith?: string) {
        if (startWith == "/") {
            return url == startWith;
        } else {
            return url.startsWith(startWith ?? "");
        }
    }

    return (
        <div className="py-1">
            <Link
                href={routeName}
                className={classNames(
                    isActive(startWith)
                        ? " text-slate-600 shadow bg-white "
                        : "text-slate-500 cursor-pointer hover:text-slate-700 hover:shadow hover:bg-white ",
                    " group mt-0 flex p-3 rounded-lg items-center text-sm font-medium  duration-300 ease-in-out transition-all w-full "
                )}
                aria-current={isActive(startWith) ? "page" : undefined}
            >

                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <DynamicHeroIcon
                            icon={icon}
                            className={classNames(
                                isActive(startWith)
                                    ? "active text-slate-600"
                                    : "text-slate-500 group-hover:text-slate-700 duration-300 ease-in-out transition-all",
                                " mr-4 h-4 w-4 flex-shrink-0 "
                            )}
                            aria-hidden="true"
                        />
                        <span className="text">{name}</span>
                    </div>
                    {count > 0 && (
                        <div className="flex items-center justify-center w-5 h-5 text-xs text-white bg-red-600 rounded-full P-4">
                            {count}
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
}
