"use client";

import { useCallback, useEffect, useState } from "react";
import { App } from "antd";
import { WhatsappSessionStatus } from "@fluiuae/database/enums";
import { describe_request_error } from "@/lib/http_client";
import {
  connect_whatsapp_request,
  disconnect_whatsapp_request,
  fetch_whatsapp_session,
} from "../api/whatsapp_api";
import type { WhatsappSessionDto } from "@/types/api";

const polling_interval_milliseconds = 3000;

export const use_whatsapp_session = (initial_session: WhatsappSessionDto) => {
  const { message } = App.useApp();
  const [session, set_session] = useState(initial_session);
  const [is_busy, set_is_busy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      set_session(await fetch_whatsapp_session());
    } catch (error) {
      message.error(describe_request_error(error));
    }
  }, [message]);

  useEffect(() => {
    if (session.status !== WhatsappSessionStatus.AWAITING_QR_SCAN) {
      return;
    }

    const interval_id = setInterval(() => {
      void refresh();
    }, polling_interval_milliseconds);

    return () => clearInterval(interval_id);
  }, [refresh, session.status]);

  const connect = async () => {
    set_is_busy(true);

    try {
      set_session(await connect_whatsapp_request());
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_busy(false);
    }
  };

  const disconnect = async () => {
    set_is_busy(true);

    try {
      set_session(await disconnect_whatsapp_request());
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_busy(false);
    }
  };

  return { session, is_busy, connect, disconnect, refresh };
};
