"use server";

import ky from "ky";
import { ENV } from "../../constants/env";
import { getTokenFromCookie, removeTokenFromCookie } from "./token-manager";

export const serverAPI = ky.create({
  prefixUrl: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = await getTokenFromCookie();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    beforeError: [
      async (error) => {
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
