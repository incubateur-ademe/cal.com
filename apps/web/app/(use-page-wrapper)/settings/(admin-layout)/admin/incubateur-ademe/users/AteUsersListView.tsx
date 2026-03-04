"use client";

import { useEffect, useState } from "react";

import { showToast } from "@calcom/ui/components/toast";

type User = {
  id: number;
  name: string | null;
  username: string | null;
  email: string;
  role: string;
  createdDate: string;
};

const AteUsersListView = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/incubateur-ademe/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users ?? []))
      .catch(() => showToast("Erreur lors du chargement des utilisateurs", "error"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="text-subtle py-8 text-center text-sm">Chargement...</div>;
  }

  if (users.length === 0) {
    return <div className="text-subtle py-8 text-center text-sm">Aucun utilisateur trouvé</div>;
  }

  return (
    <div className="border-subtle overflow-hidden rounded-md border">
      <table className="w-full text-left text-sm">
        <thead className="bg-subtle border-subtle border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Nom</th>
            <th className="px-4 py-3 font-medium">Username</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Rôle</th>
            <th className="px-4 py-3 font-medium">Créé le</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-subtle border-b last:border-b-0">
              <td className="px-4 py-3">{user.name ?? "—"}</td>
              <td className="text-subtle px-4 py-3">{user.username ?? "—"}</td>
              <td className="text-subtle px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  }`}>
                  {user.role === "ADMIN" ? "Admin" : "Utilisateur"}
                </span>
              </td>
              <td className="text-subtle px-4 py-3">
                {new Date(user.createdDate).toLocaleDateString("fr-FR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AteUsersListView;
