// API 관련 에러 코드
type ApiErrorCode =
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  | "MISSING_PARAMETER";

// 도메인 관련 에러 코드
type DomainErrorCode =
  | "WALLET_INSUFFICIENT_BALANCE"
  | "INVALID_DEPOSIT_AMOUNT"
  | "INVALID_WITHDRAW_AMOUNT"
  | "CURRENCY_MISMATCH"
  | "INVALID_AMOUNT_SCALE"
  | "EXCHANGE_RATE_CURRENCY_MISMATCH"
  | "UNSUPPORTED_FOREX_CONVERSION_CURRENCY"
  | "INVALID_EXCHANGE_RATE_CURRENCY"
  | "UNSUPPORTED_CURRENCY_FOR_KRW_CONVERSION";

// 전체 에러 코드
type ErrorCode = ApiErrorCode | DomainErrorCode;

// 성공 코드
type SuccessCode = "OK";

// API 응답 코드 (성공 + 에러)
type ResponseCode = SuccessCode | ErrorCode;

// API 응답 타입
type ApiResponse<T = unknown> = {
  code: ResponseCode;
  message: string;
  data: T;
};

// 성공 응답 타입
type SuccessResponse<T> = {
  code: "OK";
  message: string;
  data: T;
};

// 에러 응답 타입
type ErrorResponse = {
  code: ErrorCode;
  message: string;
  data: Record<string, string> | null;
};
