import defaultFormats from './defaultFormats';

export default {
  findMarksByType({ value: state }, type) {
    return state.marks.filter(m => m.type === type);
  },
  getFormat({ value: state }, format) {
    // First check if any inline styles match the format we want.
    const selectedMark = state.marks.find(mark => mark.type === format);
    if (selectedMark) {
      const value = selectedMark.data.get('value');
      if (value === undefined) return true;
      return value;
    }

    // If not, go to the block level and check there.
    const selectedBlock = state.blocks.first();
    if (selectedBlock) {
      const blockFormats = selectedBlock.data.get('formats');
      const thisFormat = blockFormats && blockFormats[format];
      if (thisFormat !== undefined) return thisFormat;
    }

    // No explicit styles applied, return default.
    return defaultFormats[format];
  },
};
