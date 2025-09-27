import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import ModeToggle from "@/components/ModeToggle";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
	href: string;
	label: string;
}

function segmentToLabel(segment: string): string {
	try {
		const decoded = decodeURIComponent(segment);
		return decoded
			.replace(/[-_]/g, " ")
			.replace(/\b\w/g, (c) => c.toUpperCase());
	} catch {
		return segment;
	}
}

export function SiteHeader() {
	const location = useLocation();
	const pathname = location.pathname;
	if (!pathname) return null;

	const segments = pathname.split("/").filter(Boolean);

	const crumbs: BreadcrumbItem[] =
		segments.length > 0
			? segments.map((seg, idx) => ({
					href: "/" + segments.slice(0, idx + 1).join("/"),
					label: segmentToLabel(seg),
			  }))
			: [];

	return (
		<header className="flex h-16 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b flex-shrink-0">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1 cursor-pointer" />
				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>

				{/* Breadcrumb Navigation */}
				<div className="hidden sm:flex text-base font-medium flex-1">
					{crumbs.length > 0 && (
						<Breadcrumb>
							<BreadcrumbList>
								{crumbs.map((crumb, i) => (
									<React.Fragment key={crumb.href}>
										{i > 0 && <BreadcrumbSeparator />}
										<BreadcrumbItem>
											{i === crumbs.length - 1 ? (
												<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
											) : (
												<BreadcrumbLink asChild>
													<Link to={crumb.href}>{crumb.label}</Link>
												</BreadcrumbLink>
											)}
										</BreadcrumbItem>
									</React.Fragment>
								))}
							</BreadcrumbList>
						</Breadcrumb>
					)}
				</div>

				{/* Header Actions */}
				<div className="ml-auto flex items-center gap-2 lg:gap-4">
					<Button
						variant="outline"
						size="icon"
						className="relative cursor-pointer"
						aria-label="View notifications"
					>
						<Bell className="h-4 w-4" />
						<span className="absolute -top-1 -right-1 h-2 w-2 bg-green-600 rounded-full animate-pulse" />
					</Button>

					<ModeToggle />
				</div>
			</div>
		</header>
	);
}

export default SiteHeader;
