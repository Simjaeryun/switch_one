import ky from "ky";
import { ENV } from "../../constants/env";

export const apiInstance = ky.create({
  prefixUrl: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [async (request) => {}],
    afterResponse: [async (request, options, response: Response) => {}],
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
