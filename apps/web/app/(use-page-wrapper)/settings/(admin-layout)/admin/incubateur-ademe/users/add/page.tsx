import { _generateMetadata } from "app/_utils";

import SettingsHeader from "@calcom/features/settings/appDir/SettingsHeader";

import AteUsersAddView from "./AteUsersAddView";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "Ajouter un utilisateur",
    () => "Créer un nouvel utilisateur ATE",
    undefined,
    undefined,
    "/settings/admin/incubateur-ademe/users/add"
  );

const Page = async () => {
  return (
    <SettingsHeader title="Ajouter un utilisateur" description="Créer un nouvel utilisateur ATE">
      <AteUsersAddView />
    </SettingsHeader>
  );
};

export default Page;
