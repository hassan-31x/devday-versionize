import OrgChange from "./_components/org-change";

const OrganizationPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OrgChange />
      {children}
    </>
  );
};

export default OrganizationPageLayout;
