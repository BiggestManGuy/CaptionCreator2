import { createHyperscript } from 'slate-hyperscript';

export default createHyperscript({
  blocks: {
    paragraph: 'paragraph',
  },
  marks: {
    font: 'font',
    size: 'size',
    color: 'color',
    weight: 'weight',
    italic: 'italic',
    underline: 'underline',
    stroke: 'stroke',
  },
});
