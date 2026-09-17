"use client";

import { Button, Form, Input } from "antd";
import type { LoginPayload } from "../api/auth_api";

type LoginFormProps = {
  is_submitting: boolean;
  on_submit: (payload: LoginPayload) => void;
};

export const LoginForm = ({ is_submitting, on_submit }: LoginFormProps) => (
  <Form<LoginPayload> layout="vertical" size="large" onFinish={on_submit} requiredMark={false}>
    <Form.Item
      name="email"
      label="E-mail"
      rules={[{ required: true, type: "email", message: "Informe um e-mail válido" }]}
    >
      <Input autoComplete="email" inputMode="email" placeholder="voce@email.com" autoFocus />
    </Form.Item>
    <Form.Item name="password" label="Senha" rules={[{ required: true, message: "Informe sua senha" }]}>
      <Input.Password autoComplete="current-password" placeholder="Sua senha" />
    </Form.Item>
    <Button type="primary" htmlType="submit" loading={is_submitting} block style={{ height: 50, marginTop: 8 }}>
      Entrar
    </Button>
  </Form>
);
