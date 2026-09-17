import {
  BufferJSON,
  initAuthCreds,
  proto,
  type AuthenticationCreds,
  type AuthenticationState,
  type SignalDataTypeMap,
} from "@whiskeysockets/baileys";
import { prisma_client } from "@fluiuae/database";

type SignalKeyStore = Record<string, Record<string, unknown>>;

const revive_json = <T>(value: unknown, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  return JSON.parse(JSON.stringify(value), BufferJSON.reviver) as T;
};

const serialize_json = (value: unknown): object =>
  JSON.parse(JSON.stringify(value, BufferJSON.replacer));

export const create_prisma_auth_state = async (user_id: string) => {
  const stored_session = await prisma_client.whatsappSession.findUnique({ where: { user_id } });

  const creds = revive_json<AuthenticationCreds>(
    stored_session?.credentials,
    initAuthCreds()
  );

  const signal_keys = revive_json<SignalKeyStore>(stored_session?.signal_keys, {});

  const persist_state = async (): Promise<void> => {
    await prisma_client.whatsappSession.upsert({
      where: { user_id },
      create: {
        user_id,
        credentials: serialize_json(creds),
        signal_keys: serialize_json(signal_keys),
      },
      update: {
        credentials: serialize_json(creds),
        signal_keys: serialize_json(signal_keys),
      },
    });
  };

  const state: AuthenticationState = {
    creds,
    keys: {
      get: async (type, ids) => {
        const store = signal_keys[type] ?? {};

        return ids.reduce<{ [id: string]: SignalDataTypeMap[typeof type] }>((result, id) => {
          const value = store[id];

          if (value) {
            result[id] = (
              type === "app-state-sync-key"
                ? proto.Message.AppStateSyncKeyData.fromObject(value as object)
                : value
            ) as SignalDataTypeMap[typeof type];
          }

          return result;
        }, {});
      },
      set: async (data) => {
        for (const type of Object.keys(data)) {
          const entries = data[type as keyof typeof data] ?? {};
          signal_keys[type] = signal_keys[type] ?? {};

          for (const id of Object.keys(entries)) {
            const value = entries[id];

            if (value) {
              signal_keys[type][id] = value;
            } else {
              delete signal_keys[type][id];
            }
          }
        }

        await persist_state();
      },
    },
  };

  return { state, persist_state };
};

export const clear_prisma_auth_state = async (user_id: string): Promise<void> => {
  await prisma_client.whatsappSession.updateMany({
    where: { user_id },
    data: { credentials: undefined, signal_keys: undefined },
  });
};
