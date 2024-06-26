/**
 * Factory helper for styled components shouldForwardProp.
 * @param {string[]} filter - Array of prop names to filter.
 * @param {boolean} [isComponent] - Whether or not to apply default HTML
 *                                  validators.
 * @returns {Function}
 */
export default function filterStyledProps(filter, isComponent = false) {
  return {
    shouldForwardProp(prop, defaultValidator) {
      return !filter.includes(prop) && (isComponent || defaultValidator(prop));
    },
  };
}
