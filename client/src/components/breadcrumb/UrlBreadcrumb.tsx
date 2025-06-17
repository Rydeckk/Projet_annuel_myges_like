import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router";

export const UrlBreadcrumb = () => {
    const location = useLocation();
    const paths = location.pathname.split("/").slice(2);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {paths.map((path, index) =>
                    paths.length === index + 1 ? (
                        <BreadcrumbItem>
                            <BreadcrumbPage className="capitalize">
                                {decodeURI(path)}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    ) : (
                        <>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink asChild>
                                    <Link
                                        className="capitalize"
                                        to={paths.slice(0, index + 1).join("/")}
                                    >
                                        {decodeURI(path)}
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                        </>
                    ),
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
