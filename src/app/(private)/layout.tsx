import { Header } from "@/components/header";
import { LinkGroup, Sidebar } from "@/components/sidebar";
import { BaggageClaimIcon, LayoutDashboardIcon, PlusIcon } from "lucide-react";
import { PropsWithChildren } from "react";

export const metadata = {
  title: "Dashboard",
};

export default function PrivateLayout({ children }: PropsWithChildren) {
  const groups: LinkGroup[] = [
    {
      links: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: <LayoutDashboardIcon />,
        },
      ],
    },
    {
      groupName: "Pedidos",
      links: [
        { href: "/pedido", label: "Pedidos", icon: <BaggageClaimIcon /> },
        {
          href: "/pedido/novo",
          label: "Novo Pedido",
          icon: <PlusIcon />,
        },
      ],
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background flex">
        <Sidebar groups={groups} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  );
}
