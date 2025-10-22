"use client";
import ModalDemo from "@/app/components/demos/ModalDemo";
import { Button } from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { useTheme } from "@/app/context/ThemeProvider";
import { Mail, User } from "lucide-react";
import z from "zod";

export default function Home() {
  const { theme, setTheme, actualTheme } = useTheme();
  const emailSchema = z.string().email('Email inválido');

  return (
    <div className="p-8 space-y-4 max-w-md mx-auto w-full">
      <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} variant="primary">
        tema {actualTheme}
      </Button>
      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        icon={Mail}
        schema={emailSchema}
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
      // icon={Lock}
      />

      <Input
        label="Usuario"
        placeholder="johndoe"
        icon={User}
        iconPosition="left"
      />

      <Input
        label="Deshabilitado"
        value="No editable"
        disabled
        icon={User}
      />

      <Input
        label="Con error"
        error="Este campo es requerido"
        icon={Mail}
      />

    <ModalDemo/>
    </div>
  );
}
