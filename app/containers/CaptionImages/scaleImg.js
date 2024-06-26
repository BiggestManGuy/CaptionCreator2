import { getFormatBoxBounds } from 'containers/CaptionFormats/selectors';

/**
 * Scales a dimension x proportional to the ratio given by y1 and y2.
 * @param {number} x
 * @param {number} y1
 * @param {number} y2
 * @returns {number}
 */
export function scaleDimension(x, y1, y2) {
  return Math.round(x * (y1 / y2));
}

export function shouldScaleImg({ ratioLock, naturalWidth, naturalHeight }) {
  return ratioLock && naturalWidth && naturalHeight;
}

export function scaleImgWidth({ height, naturalWidth, naturalHeight }) {
  return scaleDimension(naturalWidth, height, naturalHeight);
}

export function scaleImgHeight({ width, naturalWidth, naturalHeight }) {
  return scaleDimension(naturalHeight, width, naturalWidth);
}

export function scaleImg({
  newWidth,
  newHeight,
  width = newWidth,
  height = newHeight,
  naturalWidth = newWidth,
  naturalHeight = newHeight,
}) {
  const clampWidth = Math.min(newWidth, naturalWidth);
  const clampHeight = Math.min(newHeight, naturalHeight);

  if (Math.abs(newWidth - width) >= Math.abs(newHeight - height)) {
    return {
      width: clampWidth,
      height: scaleImgHeight({
        width: clampWidth,
        naturalWidth,
        naturalHeight,
      }),
    };
  }

  return {
    width: scaleImgWidth({ height: clampHeight, naturalWidth, naturalHeight }),
    height: clampHeight,
  };
}

export function scaleImgWithFormat({
  newFormat,
  format = newFormat,
  newOuterWidth,
  newOuterHeight,
  outerWidth = newOuterWidth,
  outerHeight = newOuterHeight,
  naturalWidth,
  naturalHeight,
}) {
  const [top, right, bottom, left] = getFormatBoxBounds(format);
  const [newTop, newRight, newBottom, newLeft] = getFormatBoxBounds(newFormat);

  const newInnerWidth = newOuterWidth - newRight - newLeft;
  const innerWidth = outerWidth - right - left;
  const newInnerHeight = newOuterHeight - newTop - newBottom;
  const innerHeight = outerHeight - top - bottom;

  const { width, height } = scaleImg({
    newWidth: newInnerWidth,
    newHeight: newInnerHeight,
    width: innerWidth,
    height: innerHeight,
    naturalWidth,
    naturalHeight,
  });

  return {
    width: width + newRight + newLeft,
    height: height + newTop + newBottom,
  };
}
