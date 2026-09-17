"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { App, Button, Col, Form, Input, Row } from "antd";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/data/user_avatar";
import { PageSection } from "@/components/feedback/page_section";
import { update_profile_request, type ProfilePayload } from "../api/settings_api";
import { describe_request_error } from "@/lib/http_client";
import { FormActions, ProfileHeader, ProfileName, ProfileSince } from "./settings_styles";
import type { ProfileDto } from "@/types/api";

type ProfileSectionProps = {
  profile: ProfileDto;
  on_updated: (profile: ProfileDto) => void;
};

export const ProfileSection = ({ profile, on_updated }: ProfileSectionProps) => {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm<ProfilePayload>();
  const [is_saving, set_is_saving] = useState(false);

  const handle_submit = async (values: ProfilePayload) => {
    set_is_saving(true);

    try {
      on_updated(await update_profile_request({ name: values.name, phone: values.phone || null }));
      message.success("Perfil salvo");
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_saving(false);
    }
  };

  return (
    <PageSection level="section" title="Perfil" description="Como você aparece para quem ajuda na sua carteira.">
      <ProfileHeader>
        <UserAvatar name={profile.name} size={56} />
        <div>
          <ProfileName>{profile.name}</ProfileName>
          <ProfileSince>Usando o FluiuAê desde {dayjs(profile.member_since).format("MMMM [de] YYYY")}</ProfileSince>
        </div>
      </ProfileHeader>
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ name: profile.name, phone: profile.phone ?? "" }}
        onFinish={handle_submit}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="Nome" rules={[{ required: true, min: 2, message: "Informe seu nome" }]}>
              <Input autoComplete="name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="phone" label="Telefone" extra="Opcional. Vai ser usado quando o WhatsApp chegar.">
              <Input autoComplete="tel" placeholder="(11) 91234-5678" />
            </Form.Item>
          </Col>
        </Row>
        <FormActions>
          <Button type="primary" htmlType="submit" loading={is_saving}>
            Salvar perfil
          </Button>
        </FormActions>
      </Form>
    </PageSection>
  );
};
