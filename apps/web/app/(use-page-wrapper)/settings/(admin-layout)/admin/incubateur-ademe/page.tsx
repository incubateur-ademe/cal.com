import { _generateMetadata } from "app/_utils";
import Link from "next/link";

import SettingsHeader from "@calcom/features/settings/appDir/SettingsHeader";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "Incubateur ADEME",
    () => "Administration custom Incubateur ADEME",
    undefined,
    undefined,
    "/settings/admin/incubateur-ademe"
  );

const links = [
  {
    href: "/settings/admin/incubateur-ademe/users",
    title: "Gestion des utilisateurs",
    description: "Lister et ajouter des utilisateurs",
  },
];

const Page = async () => {
  return (
    <SettingsHeader title="Incubateur ADEME" description="Administration custom Incubateur ADEME">
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border-subtle hover:border-emphasis bg-default hover:bg-subtle rounded-md border p-4 transition-colors">
            <h3 className="text-emphasis text-sm font-medium">{link.title}</h3>
            <p className="text-subtle mt-1 text-sm">{link.description}</p>
          </Link>
        ))}
      </div>
    </SettingsHeader>
  );
};

export default Page;
