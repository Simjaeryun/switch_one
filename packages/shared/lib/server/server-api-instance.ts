"use server";

import ky from "ky";
import { ENV } from "../../constants/env";
import { getTokenFromCookie, removeTokenFromCookie } from "./token-manager";
import { logger } from "./logger";

export const serverAPI = ky.create({
  prefixUrl: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        logger({
          eventType: "api_call",
          message: `[API] ${request.url} ${request.method}`,
        });
        const token = await getTokenFromCookie();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    beforeError: [
      async (error) => {
        logger({
          eventType: "api_error",
          message: `[API] ${error.message}`,
        });
        return error;
      },
    ],
    afterResponse: [
      async (request, options, response: Response) => {
        const data = await response.json();

        return data;
      },
    ],
  },
});

export const loginApiInstance = ky.create({
  prefixUrl: ENV.API_URL,
  headers: {
    accept: "*/*",
  },
  hooks: {
    afterResponse: [async (request, options, response: Response) => {}],
  },
});
