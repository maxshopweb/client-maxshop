/**
 * Extrae el código base del artículo y la extensión desde img_principal o codi_arti
 * Retorna: { code: "620004", extension: ".jpg" } o null
 */
export function extractArticleCodeAndExtension(
  imgPath: string | null | undefined, 
  codiArti?: string | null
): { code: string; extension: string } | null {
  // Si tenemos codi_arti, usarlo directamente
  if (codiArti) {
    const match = codiArti.match(/^(\d+)/);
    if (match) {
      // Intentar extraer extensión de img_principal si existe
      let extension = '.jpg'; // default
      if (imgPath) {
        const fileName = imgPath.split('/').pop() || imgPath;
        const decodedFileName = decodeURIComponent(fileName);
        const extMatch = decodedFileName.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/);
        if (extMatch) {
          extension = extMatch[0].toLowerCase();
        }
      }
      return { code: match[1], extension };
    }
  }

  // Si no, intentar extraer de img_principal
  if (!imgPath) return null;

  // Extraer el nombre del archivo de la ruta
  const fileName = imgPath.split('/').pop() || imgPath;
  
  // Decodificar URL si está codificado
  const decodedFileName = decodeURIComponent(fileName);
  
  // Extraer el código numérico al inicio
  const codeMatch = decodedFileName.match(/^(\d+)/);
  if (!codeMatch) return null;

  // Extraer la extensión
  const extMatch = decodedFileName.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/);
  const extension = extMatch ? extMatch[0].toLowerCase() : '.jpg';

  return { code: codeMatch[1], extension };
}

/**
 * Genera posibles variaciones de nombres de imagen (limitado y optimizado)
 * Solo prueba las variaciones más comunes
 */
export function generateImageVariations(
  articleCode: string, 
  extension: string
): string[] {
  const variations: string[] = [];

  // 1. Primero sin sufijo (ej: 620164.jpg)
  variations.push(`/imgs/productos/${articleCode}${extension}`);

  // 2. Luego con sufijos comunes -01, -02, -03 (máximo 3 intentos)
  for (let i = 1; i <= 3; i++) {
    const suffix = i.toString().padStart(2, '0');
    variations.push(`/imgs/productos/${articleCode}-${suffix}${extension}`);
  }

  return variations;
}

/**
 * Obtiene la URL de la imagen del producto
 * Intenta usar img_principal primero, luego busca variaciones
 */
export function getProductImageUrl(
  imgPrincipal: string | null | undefined,
  codiArti?: string | null
): string | null {
  // Si img_principal existe y es una URL válida, usarla
  if (imgPrincipal && imgPrincipal.startsWith('/imgs/productos/')) {
    return imgPrincipal;
  }

  // Si no, intentar construir desde codi_arti
  const codeAndExt = extractArticleCodeAndExtension(imgPrincipal, codiArti);
  if (codeAndExt) {
    // Retornar la primera variación (sin sufijo)
    return `/imgs/productos/${codeAndExt.code}${codeAndExt.extension}`;
  }

  return null;
}

