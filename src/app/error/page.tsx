import { ErrorType } from "@/lib/error-types";
import { ReactNode } from "react";

type ErrorPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
  const { error } = await searchParams;
  const errorMessage = getErrorMessage(error as ErrorType);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-4xl font-bold text-primary">{errorMessage.title}</h1>
      <p className="mt-4 text-lg text-foreground">{errorMessage.message}</p>
    </div>
  );
}

function getErrorMessage(error: ErrorType): {
  title: string;
  message: string | ReactNode;
} {
  switch (error) {
    case ErrorType.SUBDOMAIN_NOT_FOUND:
      return {
        title:
          "Ops! Não conseguimos encontrar a página que você está procurando.",
        message: (
          <>
            O link que você acessou está incompleto. <br />
            Verifique se ele inclui o nome do serviço ou empresa que você deseja
            acessar. <br />
            Se precisar de ajuda, fale com nosso suporte. <br />
            Estamos aqui para ajudar!
          </>
        ),
      };
    default:
      return {
        title: "Algo deu errado!",
        message: (
          <>
            Ocorreu um problema ao tentar carregar a página. <br />
            Tente novamente mais tarde ou entre em contato com o suporte se o
            problema persistir. <br />
            Estamos aqui para ajudar!
          </>
        ),
      };
  }
}
