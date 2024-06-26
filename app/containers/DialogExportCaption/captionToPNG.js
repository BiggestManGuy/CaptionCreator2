import html2canvas from 'html2canvas';

/**
 * Removes any elements with the data-exclude-render attribute.
 * @param {Element} caption - Root caption element. This should be a clone.
 */
function filterExcludedElements(caption) {
  const excluded = caption.querySelectorAll('[data-exclude-render]');
  for (let i = 0; i < excluded.length; i += 1) {
    excluded[i].remove();
  }
}

/**
 * Converts a html caption to a PNG image blob via html2canvas.
 * @param {String} captionRootId Caption container element ID.
 * @param {Object} opts html2canvas options.
 * @returns {Promise<Blob>}
 */
export default async function captionToPNG(captionRootId, opts = {}) {
  const captionRoot = document.getElementById(captionRootId);
  const canvas = await html2canvas(captionRoot, {
    logging: false,
    width: captionRoot.offsetWidth,
    height: captionRoot.offsetHeight,
    y: 0,
    x: 0,
    scrollX: 0,
    scrollY: 0,
    allowTaint: true, // Set to allow blob: URLs. See PR https://github.com/niklasvh/html2canvas/pull/2063
    backgroundColor: null,
    onclone(doc) {
      const captionRootClone = doc.getElementById(captionRootId);

      // Render caption as a root body element.
      // The AdjustableView which the caption is embedded in tends to screw up
      // the output.
      const body = document.createElement('body');
      body.appendChild(captionRootClone);
      doc.body = body; // eslint-disable-line no-param-reassign

      filterExcludedElements(captionRootClone);

      return doc;
    },
    ...opts,
  });
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob));
  });
}
