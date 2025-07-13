"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import useProject from "@/hooks/use-project";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import {
  Bot,
  CreditCard,
  LayoutDashboard,
  Menu,
  Plus,
  Presentation,
} from "lucide-react";

import logo from "@/assets/logo.png";
import title from "@/assets/title.png";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Q&A", url: "/qa", icon: Bot },
  { title: "Meetings", url: "/meetings", icon: Presentation },
  { title: "Billing", url: "/billing", icon: CreditCard },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const { projects, projectId, setProjectId } = useProject();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image src={logo} alt="gitwit-logo" width={40} height={40} />
          {open && <Image src={title} alt="gitwit-title" height={60} />}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      aria-current={pathname === item.url ? "page" : undefined}
                      className={cn({
                        "!bg-primary !text-white": pathname === item.url,
                      })}
                      onClick={() => setMobileOpen(false)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton
                    onClick={() => {
                      setProjectId(project.id);
                      router.push("/dashboard");
                      setMobileOpen(false);
                    }}
                    className="text-left"
                  >
                    <div
                      className={cn(
                        "text-primary flex size-6 items-center justify-center rounded-sm border bg-white text-sm",
                        {
                          "bg-primary text-white": project.id === projectId,
                        },
                      )}
                    >
                      {project.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <span>{project.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <div className="h-2" />

              {open && (
                <SidebarMenuItem>
                  <Link href="/create" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" variant="outline" className="w-fit">
                      <Plus className="mr-1 h-4 w-4" />
                      Create Project
                    </Button>
                  </Link>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );

  return (
    <>
      <div className="absolute p-2 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="mt-1 ml-2 border"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle></SheetTitle>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:block">
        <Sidebar collapsible="icon" variant="floating">
          {sidebarContent}
        </Sidebar>
      </div>
    </>
  );
}
