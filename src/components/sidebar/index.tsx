"use client";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, useState } from "react";

type LinkItem = {
  href: string;
  label: string;
  icon?: JSX.Element;
};

export type LinkGroup = {
  groupName?: string;
  links: LinkItem[];
};

type SidebarProps = {
  groups: LinkGroup[];
};

export function Sidebar({ groups }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    groups.forEach((group) => {
      if (group.groupName === undefined) {
        return;
      }

      if (group.groupName === "Principal") {
        initialState[group.groupName] = true;
        return;
      }
      initialState[group.groupName] = false;
    });
    return initialState;
  });
  const pathname = usePathname();

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const isActive = (href: string) => {
    const currentPath = pathname;

    return currentPath === href;
  };

  const renderLink = (link: LinkItem) => {
    return (
      <Link
        key={link.href}
        href={link.href}
        className={`ml-2 flex gap-2 items-center ${
          isActive(link.href)
            ? "text-primary font-semibold"
            : "text-foreground hover:text-primary"
        }`}
      >
        {link.icon}
        {link.label}
      </Link>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 256 : 96 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-w-0 min-h-screen bg-background shadow-md border-r border-border flex flex-col p-4 overflow-hidden relative"
    >
      <Button
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label={sidebarOpen ? "Recolher sidebar" : "Expandir sidebar"}
        variant="secondary"
        className="absolute top-4 right-4 cursor-pointer"
      >
        <motion.div
          key="collapse"
          whileTap={{ rotate: 360 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </motion.div>
      </Button>

      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.nav
            key="nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-12 space-y-4 overflow-y-auto flex-1 overflow-x-hidden"
          >
            {groups.map((group) => {
              if (!group.groupName) {
                return group.links.map((link) => renderLink(link));
              }

              return (
                <div key={group.groupName}>
                  <h3
                    className="text-sm font-semibold mb-2 flex items-center justify-between cursor-pointer hover:bg-accent p-2 rounded"
                    onClick={() => toggleGroup(group.groupName!)}
                  >
                    {group.groupName}
                    {openGroups[group.groupName] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </h3>
                  <AnimatePresence initial={false}>
                    {openGroups[group.groupName] && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="space-y-2 ml-2 overflow-hidden"
                      >
                        {group.links.map((link) => renderLink(link))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
