const MAX_TEXT = 200;

export function textValue(value: unknown, fallback = "", max = MAX_TEXT) {
  if (typeof value !== "string") return fallback;
  return value.trim().slice(0, max);
}

export function requiredText(value: unknown, label: string, max = MAX_TEXT) {
  const result = textValue(value, "", max);
  if (!result) throw new Error(`${label}은(는) 필수입니다.`);
  return result;
}

export function nonNegativeInteger(value: unknown, fallback = 0) {
  if (value === undefined || value === null || value === "") return fallback;
  const result = Number(value);
  if (!Number.isSafeInteger(result) || result < 0) throw new Error("수량과 금액은 0 이상의 정수여야 합니다.");
  return result;
}

export function idValue(value: unknown) {
  const result = Number(value);
  if (!Number.isSafeInteger(result) || result < 1) throw new Error("유효하지 않은 식별자입니다.");
  return result;
}

export function errorMessage(error: unknown, fallback = "요청을 처리하지 못했습니다.") {
  return error instanceof Error ? error.message : fallback;
}
