"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { Button } from "@calcom/ui/components/button";
import { EmailField, Form, Label, Select, TextField } from "@calcom/ui/components/form";
import { showToast } from "@calcom/ui/components/toast";

type FormValues = {
  name: string;
  email: string;
  username: string;
  role: { value: string; label: string };
};

const roleOptions = [
  { value: "USER", label: "Utilisateur" },
  { value: "ADMIN", label: "Administrateur" },
];

const AteUsersAddView = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      username: "",
      role: roleOptions[0],
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/incubateur-ademe/admin/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          username: values.username,
          role: values.role.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Erreur lors de la création", "error");
        return;
      }

      showToast("Utilisateur créé. Un email de configuration du mot de passe a été envoyé.", "success");
      router.push("/settings/admin/incubateur-ademe/users");
    } catch {
      showToast("Erreur inattendue", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form form={form} handleSubmit={onSubmit} className="space-y-6">
      <TextField label="Nom" required {...form.register("name")} />
      <TextField label="Nom d'utilisateur" required {...form.register("username")} />
      <EmailField label="Email" required {...form.register("email")} />
      <Controller
        name="role"
        control={form.control}
        render={({ field: { onChange, value } }) => (
          <div>
            <Label htmlFor="role">Rôle</Label>
            <Select value={value} options={roleOptions} onChange={onChange} />
          </div>
        )}
      />
      <Button type="submit" loading={isSubmitting}>
        Ajouter l&apos;utilisateur
      </Button>
    </Form>
  );
};

export default AteUsersAddView;
