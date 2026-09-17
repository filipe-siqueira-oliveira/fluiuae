"use client";

import { Button } from "antd";
import Link from "next/link";
import { ErrorScreen } from "@/components/feedback/error_screen";

const NotFoundPage = () => (
  <ErrorScreen
    code="Erro 404"
    title="Página não encontrada"
    description="O endereço pode estar errado ou a página mudou de lugar."
    actions={
      <Link href="/home">
        <Button type="primary">Ir para o início</Button>
      </Link>
    }
  />
);

export default NotFoundPage;
