"use client";

import { Button } from "antd";
import Link from "next/link";
import { ErrorScreen } from "@/components/feedback/error_screen";

type ErrorPageProps = {
  reset: () => void;
};

const ErrorPage = ({ reset }: ErrorPageProps) => (
  <ErrorScreen
    code="Erro inesperado"
    title="Algo deu errado nesta tela"
    description="Não conseguimos mostrar esta página agora. Tente de novo; se continuar, volte para o início."
    actions={
      <>
        <Button type="primary" onClick={reset}>
          Tentar de novo
        </Button>
        <Link href="/home">
          <Button>Ir para o início</Button>
        </Link>
      </>
    }
  />
);

export default ErrorPage;
