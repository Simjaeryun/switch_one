import ky from "ky";
import { ENV } from "../../constants/env";
import { getTokenFromCookie } from "./token-manager";

export const apiInstance = ky.create({
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
    afterResponse: [
      async (request, options, response: Response) => {
        const data = await response.json();
        return data;
      },
    ],
  },
});

export const loginApiInstance = apiInstance.create({
  prefixUrl: ENV.API_URL,
  headers: {
    accept: "*/*",
  },
  hooks: {
    afterResponse: [async (request, options, response: Response) => {}],
  },
});
