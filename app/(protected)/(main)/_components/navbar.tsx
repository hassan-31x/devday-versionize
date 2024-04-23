import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import React from "react";

const Navbar = () => {
  return (
    <div className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center ">
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>

        <Button className="rounded-sm md:h-auto md:py-1.5 md:px-2">
            <span className="hidden md:block">Create</span>
            <Plus className="h-4 w-4 block md:hidden" />
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher hidePersonal afterCreateOrganizationUrl='/organization/:id' afterSelectOrganizationUrl='/organization/:id' afterLeaveOrganizationUrl='/select-org' appearance={{
            elements: {
                rootBox: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            }
        }} />
        <UserButton afterSignOutUrl="/" appearance={{
            elements: {
                avatarBox: {
                    height: 30,
                    width: 30,
                }
            }
        }} />
      </div>
    </div>
  );
};

export default Navbar;
