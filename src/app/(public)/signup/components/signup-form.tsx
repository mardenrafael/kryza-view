"use client";

import { EmailField } from "@/components/fields/email-field";
import { PasswordField, TextField } from "@/components/fields";
import { Form } from "@/components/ui/form";
import { useSignUpForm } from "../hooks/use-signup-form";
import { Button } from "@/components/button";

export function SignUpForm() {
  const { form, onSubmit, control, isLoading } = useSignUpForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <TextField
            control={control}
            label="Seu nome"
            name="name"
            placeholder="Digite seu nome"
          />
          <EmailField control={control} />
          <PasswordField control={control} />
          <PasswordField
            label="Confirme sua senha"
            placeholder="Confirme sua senha"
            name="confirmPassword"
            control={control}
          />

          <Button name="submit" label="Cadastrar" isLoading={isLoading} />
        </div>
      </form>
    </Form>
  );
}
