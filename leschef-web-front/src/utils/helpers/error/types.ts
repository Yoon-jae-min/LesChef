/**
 * 에러 처리 타입 정의
 */

export interface ApiError {
  error: true;
  message: string;
  details?: string | string[] | Array<{ field: string; fieldName?: string; message: string; value?: unknown }>;
  field?: string;
  fieldName?: string;
  value?: unknown;
  duplicateValue?: unknown;
  path?: string;
  maxSize?: number;
  maxSizeMB?: number;
  maxCount?: number;
  stack?: string;
  originalError?: string;
}

