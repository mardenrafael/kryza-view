import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "./components/signin-form";

export default async function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-primary text-lg sm:text-xl">
              Kryza | Entrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SignInForm />
            <p className="mt-4 text-sm text-center text-foreground">
              Não tem uma conta?{" "}
              <a href="/register" className="text-primary hover:underline">
                Cadastre-se
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
