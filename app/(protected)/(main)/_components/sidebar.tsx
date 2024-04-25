"use client";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import SidebarItem from "./sidebar-item";

type SidebarProps = {
  storageKey?: string;
};

const Sidebar = ({ storageKey = "versionize-sidebar" }: SidebarProps) => {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(storageKey, {});

  const { organization: activeOrganization, isLoaded: isOrgLoaded } = useOrganization();
  const { userMemberships, isLoaded: isOrgListLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce((acc: string[], key: string) => {
    if (expanded[key]) {
      acc.push(key);
    }

    return acc;
  }, []);

  const handleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !expanded[id],
    }));
  };

  if (!isOrgLoaded || !isOrgListLoaded || userMemberships.isLoading) {
    return (
      <>
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-10 w-[50%]" />
        <Skeleton className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <SidebarItem.Skeleton />
        <SidebarItem.Skeleton />
        <SidebarItem.Skeleton />
      </div>
      </>
    );
  }

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4">Projects</span>
        <Button asChild type="button" size="icon" variant="ghost" className="ml-auto">
          <Link href="/select-org">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={defaultAccordionValue} className="space-y-2">
        {userMemberships.data.map(({ organization }) => (
          <SidebarItem
            key={organization.id}
            isActive={activeOrganization?.id === organization.id}
            isExpanded={expanded[organization.id]}
            organization={organization as Organization}
            handleExpand={handleExpand}
          />
        ))}
      </Accordion>
    </>
  );
};

export default Sidebar;
