import { OrganizationList } from "@clerk/nextjs";

const OrganizationPage = () => {
  return <OrganizationList hidePersonal afterCreateOrganizationUrl="/organization/:id" afterSelectOrganizationUrl="/organization/:id" />;
};

export default OrganizationPage;
