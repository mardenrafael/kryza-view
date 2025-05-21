"use client";

import { EmailField } from "@/components/fields/email-field";
import { PasswordField } from "@/components/fields";
import { Form } from "@/components/ui/form";
import { useSignInForm } from "../hooks/use-signin-form";
import { Button } from "@/components/button";

export function SignInForm() {
  const { form, onSubmit, control, isLoading } = useSignInForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <EmailField control={control} />
        </div>
        <div className="mb-6">
          <PasswordField control={control} />
        </div>
        <div>
          <Button label="Entrar" isLoading={isLoading} />
        </div>
      </form>
    </Form>
  );
}
