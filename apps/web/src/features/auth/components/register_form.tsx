"use client";

import { Button, Form, Input } from "antd";
import type { RegisterPayload } from "../api/auth_api";

type RegisterFormProps = {
  is_submitting: boolean;
  on_submit: (payload: RegisterPayload) => void;
};

export const RegisterForm = ({ is_submitting, on_submit }: RegisterFormProps) => (
  <Form<RegisterPayload> layout="vertical" size="large" onFinish={on_submit} requiredMark={false}>
    <Form.Item name="name" label="Nome" rules={[{ required: true, min: 2, message: "Informe seu nome" }]}>
      <Input autoComplete="name" placeholder="Como quer ser chamado" autoFocus />
    </Form.Item>
    <Form.Item
      name="email"
      label="E-mail"
      rules={[{ required: true, type: "email", message: "Informe um e-mail válido" }]}
    >
      <Input autoComplete="email" inputMode="email" placeholder="voce@email.com" />
    </Form.Item>
    <Form.Item
      name="password"
      label="Senha"
      extra="Pelo menos 8 caracteres."
      rules={[{ required: true, min: 8, message: "A senha precisa ter ao menos 8 caracteres" }]}
    >
      <Input.Password autoComplete="new-password" placeholder="Crie uma senha" />
    </Form.Item>
    <Button type="primary" htmlType="submit" loading={is_submitting} block style={{ height: 50, marginTop: 8 }}>
      Criar conta
    </Button>
  </Form>
);
