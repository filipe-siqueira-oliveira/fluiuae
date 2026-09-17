import { toDataURL } from "qrcode";

export const render_qr_code_as_data_url = (qr_code_text: string): Promise<string> =>
  toDataURL(qr_code_text, { margin: 1, width: 264 });
