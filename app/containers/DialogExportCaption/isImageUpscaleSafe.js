export default function isImageUpscaleSafe(
  scale,
  { width, height, naturalWidth, naturalHeight },
) {
  if (!naturalWidth || !naturalHeight) return true;
  return naturalWidth >= width * scale && naturalHeight >= height * scale;
}
