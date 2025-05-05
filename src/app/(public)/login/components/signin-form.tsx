"use client";

import { EmailField } from "@/components/fields/email-field";
import { PasswordField } from "@/components/fields/password-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useSignInForm } from "../hooks/use-signin-form";

export function SignInForm() {
  const { form, onSubmit, control } = useSignInForm();

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
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </div>
      </form>
    </Form>
  );
}
