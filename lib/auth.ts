import { SessionOptions } from "iron-session";

export interface SessionData {
  userId?: string;
  walletAddress?: string;
  nonce?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "procreation_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
