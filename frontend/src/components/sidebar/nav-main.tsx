import * as React from "react";
import { Film, Folder, LayoutDashboard, Settings } from "lucide-react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

const NavMain: React.FC = () => {
	const navigate = useNavigate();
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu className="space-y-2 text-pretty">
					<SidebarMenuItem className="flex items-center gap-4">
						<SidebarMenuButton
							onClick={() => navigate("/dashboard")}
							tooltip="View your automation stats and recent activity"
							className="bg-card h-10 py-4 border text-primary min-w-8 flex items-center gap-2 
      cursor-pointer duration-200 ease-linear hover:text-blue-600 active:text-blue-700"
						>
							<LayoutDashboard size={20} className="text-blue-500" />
							<p>Dashboard</p>
						</SidebarMenuButton>
					</SidebarMenuItem>

					<SidebarMenuItem className="flex items-center gap-4">
						<SidebarMenuButton
							tooltip="View, create, edit, and manage your RAG workflows"
							className="bg-card h-10 py-4 border text-primary min-w-8 flex items-center gap-2 
               cursor-pointer duration-200 ease-linear hover:text-lime-600 active:text-lime-700"
							onClick={() => navigate("/workflow")}
						>
							<Settings size={20} className="text-lime-500" />
							<p>Workflows</p>
						</SidebarMenuButton>
					</SidebarMenuItem>

					<SidebarMenuItem className="flex items-center gap-4">
						<SidebarMenuButton
							onClick={() => navigate("/assets")}
							tooltip="Upload and manage images, audio, and video used in workflows"
							className="bg-card h-10 py-4 border text-primary min-w-8 flex items-center gap-2 
      cursor-pointer duration-200 ease-linear hover:text-purple-600 active:text-purple-700"
						>
							<Folder size={20} className="text-purple-500" />
							<p>Media Library</p>
						</SidebarMenuButton>
					</SidebarMenuItem>

					<SidebarMenuItem className="flex items-center gap-4">
						<SidebarMenuButton
							onClick={() => navigate("/posts")}
							tooltip="View all published or scheduled posts"
							className="bg-card h-10 py-4 border text-primary min-w-8 flex items-center gap-2 
      cursor-pointer duration-200 ease-linear hover:text-orange-600 active:text-orange-700"
						>
							<Film size={20} className="text-orange-500" />
							<p>Published Posts</p>
						</SidebarMenuButton>
					</SidebarMenuItem>

					<SidebarMenuItem className="flex items-center gap-4">
						<SidebarMenuButton
							onClick={() => navigate("/settings")}
							tooltip="Manage app-wide settings, integrations, and tokens"
							className="bg-card h-10 py-4 border text-primary min-w-8 flex items-center gap-2 
      cursor-pointer duration-200 ease-linear hover:text-gray-600 active:text-gray-700"
						>
							<Settings size={20} className="text-gray-500" />
							<p>Settings</p>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
};

export default NavMain;
