import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCheck, Folders, GitGraph, Settings } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  isExpanded: boolean;
  isActive: boolean;
  organization: Organization;
  handleExpand: (id: string) => void;
};

const SidebarItem = ({ isExpanded, isActive, organization, handleExpand }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const sidebarItems = [
    {
      label: "Files",
      icon: <Folders className="w-4 h-4 mr-2" />,
      href: `/organization/${organization.id}`,
    },
    {
      label: "Commits",
      icon: <GitGraph className="w-4 h-4 mr-2" />,
      href: `/organization/${organization.id}/commits`,
    },
    {
      label: "Tasks",
      icon: <CheckCheck className="w-4 h-4 mr-2" />,
      href: `/organization/${organization.id}/tasks`,
    },
    {
      label: "Settings",
      icon: <Settings className="w-4 h-4 mr-2" />,
      href: `/organization/${organization.id}/settings`,
    },
  ];

  const handleRedirect = (href: string) => {
    router.push(href);
  };

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => handleExpand(organization.id)}
        className={cn(
          "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
          isActive && !isExpanded ? "bg-sky-500/10" : "text-sky-700"
        )}
      >
        <div className="flex items-center gap-x-2">
          <div className="w-7 h-7 relative">
            <Image fill src={organization.imageUrl} alt="organization" className="rounded-sm object-cover" />
          </div>

          <span className="font-medium text-sm">{organization.name}</span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pt-1 text-neutral-700">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            size="sm"
            onClick={() => handleRedirect(item.href)}
            variant="ghost"
            className={cn("w-full font-normal justify-start pl-10 mb-1", pathname === item.href && "bg-sky-500/10 text-sky-700")}
          >
            {item.icon} {item.label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

SidebarItem.Skeleton = function SkeletonSidebarItem() {
  return (
    <div className="flex items-center gap-x-2">
      <div className="w-10 h-10 relative shrink-0">
        <Skeleton className="h-full w-full absolute" />
      </div>
        <Skeleton className="h-10 w-full" />
    </div>
  )
}

export default SidebarItem;
