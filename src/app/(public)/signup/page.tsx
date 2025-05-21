import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "./components/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar conta",
};

export default async function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-primary text-lg sm:text-xl">
              Kryza | Criar conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
