import Link from "next/link";
import { AcmeIcon } from "../icons/acme-icon";

interface Company {
  name: string;
  logo: React.ReactNode;
}

const company = {
  name: "Planorama",
  logo: <AcmeIcon />,
};

export const CompaniesDropdown = () => {
  return (
    <Link
      className="flex items-center justify-center gap-x-2 cursor-pointer"
      href="/dashboard"
      color="foreground"
    >
      <div>{company.logo}</div>
      <h3 className="text-xl font-medium text-default-900 whitespace-nowrap block">
        {company.name}
      </h3>
    </Link>
  );
};
