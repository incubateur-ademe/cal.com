import { _generateMetadata } from "app/_utils";

import SettingsHeader from "@calcom/features/settings/appDir/SettingsHeader";
import { Button } from "@calcom/ui/components/button";

import AteUsersListView from "./AteUsersListView";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "Gestion des utilisateurs",
    () => "Liste des utilisateurs ATE",
    undefined,
    undefined,
    "/settings/admin/incubateur-ademe/users"
  );

const Page = async () => {
  return (
    <SettingsHeader
      title="Gestion des utilisateurs"
      description="Liste des utilisateurs ATE"
      CTA={<Button href="/settings/admin/incubateur-ademe/users/add">Ajouter un utilisateur</Button>}>
      <AteUsersListView />
    </SettingsHeader>
  );
};

export default Page;
