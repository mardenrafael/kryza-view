"use client";

import { Header } from "@/components/header";
import { RouteGuard } from "@/components/route-guard";
import { LinkGroup, Sidebar } from "@/components/sidebar";
import { BaggageClaimIcon, LayoutDashboardIcon, PlusIcon } from "lucide-react";
import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  const groups: LinkGroup[] = [
    {
      links: [
        {
          href: "/app",
          label: "Dashboard",
          icon: <LayoutDashboardIcon />,
        },
      ],
    },
    {
      groupName: "Pedidos",
      links: [
        { href: "/app/pedido", label: "Meus Pedidos", icon: <BaggageClaimIcon /> },
        {
          href: "/app/pedido/novo",
          label: "Novo Pedido",
          icon: <PlusIcon />,
        },
      ],
    },
  ];

  return (
    <RouteGuard allowedForUsers={true} allowedForOwner={false}>
      <Header />
      <div className="min-h-screen bg-background flex">
        <Sidebar groups={groups} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </RouteGuard>
  );
} 