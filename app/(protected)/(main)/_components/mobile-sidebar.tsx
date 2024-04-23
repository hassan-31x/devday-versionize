"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import Sidebar from "./sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";

const MobileSidebar = () => {
  const [iseMounted, setIsMounted] = useState(false);

  const pathname = usePathname();
  const { handleOpen, handleClose, isOpen } = useMobileSidebar((state) => state);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    handleClose();
  }, [pathname, handleClose]);

  if (!iseMounted) return null;

  return (
    <>
      <Button onClick={handleOpen} className="block md:hidden mr-2" variant="ghost" size="sm">
        <Menu className="h-4 w-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent side="left" className="p-2 pt-10">
          <Sidebar storageKey="versionize-mobile-sidebar" />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
