import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Control } from "react-hook-form";

type PasswordFieldProps = {
  control: Control<any, any, any>;
  name?: string;
} & ComponentProps<"input">;

export function PasswordField({
  control,
  name = "password",
  className,
  ...rest
}: PasswordFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="block text-sm font-medium text-primary">
              Senha
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                {...rest}
                value={field.value || ""}
                type="password"
                placeholder="Digite sua senha"
                className={cn("mt-1", className)}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
