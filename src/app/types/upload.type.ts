/** Respuesta del API de upload (productos y banners). */
export interface UploadResponse {
  success: boolean;
  path: string;
  url?: string;
}

/** Resultado normalizado que exponen servicio y hooks. */
export interface UploadResult {
  path: string;
  url: string;
}
