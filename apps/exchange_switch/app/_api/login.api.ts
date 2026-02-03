import { apiInstance } from "@repo/shared/lib";
import { END_POINT } from "./end-point";

export const loginAPI = {
  login: async (email: string) => {
    const response = await apiInstance.post(END_POINT.LOGIN, {
      json: { email },
    });
    return response.json();
  },
};
