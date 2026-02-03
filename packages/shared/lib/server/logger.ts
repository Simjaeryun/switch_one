type EventType =
  | "runtime_error"
  | "api_error"
  | "network_error"
  | "user_action"
  | "api_call"
  | "";
type LogLevel = "error" | "warn" | "info" | "debug";

interface LogData {
  eventType?: EventType;
  message: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  eventType?: EventType;
  message: string;
  metadata?: Record<string, any>;
}

// ANSI 색상 코드
const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  green: "\x1b[32m",
} as const;

// 로그 레벨별 색상 및 아이콘 설정
const LOG_LEVEL_CONFIG = {
  error: { color: COLORS.red, icon: "✗", label: "ERROR" },
  warn: { color: COLORS.yellow, icon: "⚠", label: "WARN " },
  info: { color: COLORS.blue, icon: "ℹ", label: "INFO " },
  debug: { color: COLORS.cyan, icon: "◦", label: "DEBUG" },
} as const;

// 환경변수에서 로그 레벨 설정 (기본값: info)
const LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel) || "info";

// 로그 레벨 우선순위 (낮을수록 높은 우선순위)
const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
} as const;

/**
 * 이벤트 타입에 따른 적절한 로그 레벨을 결정합니다.
 */
function getLogLevelFromEventType(eventType: EventType = ""): LogLevel {
  const eventTypeToLevel: Record<EventType, LogLevel> = {
    runtime_error: "error",
    api_error: "error",
    network_error: "warn",
    user_action: "info",
    api_call: "info",
    "": "info",
  };

  return eventTypeToLevel[eventType] || "info";
}

/**
 * 현재 설정된 로그 레벨에서 해당 레벨의 로그를 출력할지 결정합니다.
 */
function isLevelEnabled(level: LogLevel): boolean {
  return LOG_LEVELS[level] <= LOG_LEVELS[LOG_LEVEL];
}

/**
 * 로그 엔트리를 생성합니다.
 */
function createLogEntry(logData: LogData, level: LogLevel): LogEntry {
  const { eventType, message, metadata, timestamp = new Date() } = logData;

  return {
    timestamp: timestamp.toISOString(),
    level,
    eventType,
    message,
    ...(metadata && { metadata }),
  };
}

/**
 * 시간을 읽기 쉬운 형태로 포맷팅합니다.
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/**
 * 메타데이터를 보기 좋게 포맷팅합니다.
 */
function formatMetadata(metadata?: Record<string, any>): string {
  if (!metadata || Object.keys(metadata).length === 0) {
    return "";
  }

  const formatted = Object.entries(metadata)
    .map(([key, value]) => {
      const valueStr =
        typeof value === "object"
          ? JSON.stringify(value, null, 2).replace(/\n/g, "\n    ")
          : String(value);
      return `  ${COLORS.dim}${key}:${COLORS.reset} ${valueStr}`;
    })
    .join("\n");

  return `\n${COLORS.dim}┌─ metadata${COLORS.reset}\n${formatted}\n${COLORS.dim}└─────────${COLORS.reset}`;
}

/**
 * 로그 레벨에 따라 적절한 console 메서드로 출력합니다.
 */
function outputLog(logEntry: LogEntry): void {
  const config = LOG_LEVEL_CONFIG[logEntry.level];
  const timestamp = formatTimestamp(logEntry.timestamp);
  const metadata = formatMetadata(logEntry.metadata);

  // 헤더 라인 구성
  const separator = "─".repeat(80);
  const header = `${COLORS.dim}${separator}${COLORS.reset}`;

  // 메인 로그 라인 구성
  const levelBadge = `${config.color}${COLORS.bright}[${config.label}]${COLORS.reset}`;
  const eventTypeBadge = logEntry.eventType
    ? `${COLORS.gray}[${logEntry.eventType.toUpperCase()}]${COLORS.reset} `
    : "";
  const timestampFormatted = `${COLORS.gray}${timestamp}${COLORS.reset}`;

  const mainLine = `${levelBadge} ${eventTypeBadge}${timestampFormatted}`;
  const messageLine = `${config.color}${logEntry.message}${COLORS.reset}`;

  // 전체 로그 메시지 조합
  const fullMessage = [header, mainLine, messageLine, metadata, header]
    .filter(Boolean)
    .join("\n");

  // 레벨에 따른 적절한 console 메서드 사용
  switch (logEntry.level) {
    case "error":
      console.error(fullMessage);
      break;
    case "warn":
      console.warn(fullMessage);
      break;
    case "info":
      console.info(fullMessage);
      break;
    case "debug":
      console.debug(fullMessage);
      break;
  }
}

/**
 * 구조화된 로깅을 위한 메인 로거 함수
 *
 * 서버 액션으로 수행되어 서버 터미널에 출력되며,

 * @param logData - 로그 데이터 객체
 */
export async function logger(logData: LogData): Promise<void> {
  try {
    // 이벤트 타입에 따른 로그 레벨 결정
    const level = getLogLevelFromEventType(logData.eventType);

    // 현재 설정된 로그 레벨 기준으로 필터링
    if (!isLevelEnabled(level)) {
      return;
    }

    // 로그 엔트리 생성 및 출력
    const logEntry = createLogEntry(logData, level);
    outputLog(logEntry);
  } catch (error) {
    // 로거 자체에서 에러가 발생한 경우 fallback
    console.error("Logger error:", error);
    console.error("Original log data:", logData);
  }
}
