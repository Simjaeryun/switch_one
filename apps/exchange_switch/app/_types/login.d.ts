type LoginResponse = {
  memberId: number;
  token: string;
};

export type LoginDTO = {
  LoginResponse: LoginResponse;
};
