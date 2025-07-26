"use client";

import { Header } from "@/components/header";
import { LinkGroup, Sidebar } from "@/components/sidebar";
import { RouteGuard } from "@/components/route-guard";
import { Settings, LayoutDashboardIcon } from "lucide-react";
import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
  const groups: LinkGroup[] = [
    {
      links: [
        {
          href: "/admin/dashboard",
          label: "Dashboard",
          icon: <LayoutDashboardIcon />,
        },
      ],
    },
    {
      groupName: "Administração",
      links: [
        {
          href: "/admin/pedidos",
          label: "Gerenciar Pedidos",
          icon: <Settings />,
        },
      ],
    },
  ];

  return (
    <RouteGuard allowedForUsers={false} allowedForOwner={true}>
      <Header />
      <div className="min-h-screen bg-background flex">
        <Sidebar groups={groups} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </RouteGuard>
  );
} 