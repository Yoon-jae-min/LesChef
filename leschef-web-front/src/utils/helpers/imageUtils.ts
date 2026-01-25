/**
 * 이미지 유틸리티 함수
 * 썸네일 경로 생성 및 이미지 최적화 관련 함수
 */

/**
 * 썸네일 경로 생성
 * 원본 이미지 경로에서 썸네일 경로를 생성합니다.
 * @param originalPath 원본 이미지 경로
 * @returns 썸네일 경로 (없으면 원본 경로 반환)
 */
export function getThumbnailPath(originalPath: string | undefined): string {
  if (!originalPath) return '';
  
  // 이미 썸네일 경로인 경우 그대로 반환
  if (originalPath.includes('/thumbnails/')) {
    return originalPath;
  }
  
  // 썸네일 경로 생성: /Image/RecipeImage/ListImg/korean/image.jpg -> /Image/RecipeImage/ListImg/korean/thumbnails/image_thumb.jpg
  const pathParts = originalPath.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const extIndex = fileName.lastIndexOf('.');
  
  if (extIndex === -1) {
    return originalPath; // 확장자가 없으면 원본 반환
  }
  
  const nameWithoutExt = fileName.substring(0, extIndex);
  const ext = fileName.substring(extIndex);
  const thumbnailFileName = `${nameWithoutExt}_thumb${ext}`;
  
  // thumbnails 폴더 경로 삽입
  const dirPath = pathParts.slice(0, -1).join('/');
  return `${dirPath}/thumbnails/${thumbnailFileName}`;
}

/**
 * 이미지 placeholder 생성 (blur data URL)
 * @param width 너비
 * @param height 높이
 * @returns base64 인코딩된 placeholder
 */
export function generateImagePlaceholder(width = 400, height = 240): string {
  // 간단한 SVG placeholder 생성 (브라우저 호환)
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-size="14">Loading...</text>
    </svg>
  `.trim();
  
  // 브라우저에서 사용 가능한 방법으로 base64 인코딩
  // URL 인코딩 후 base64 인코딩
  try {
    if (typeof window !== 'undefined') {
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    }
  } catch {
    // btoa 실패 시 인코딩된 SVG 반환
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }
  
  // 서버 사이드에서는 인코딩된 SVG 반환
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

