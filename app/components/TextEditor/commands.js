export default {
  applyInlineFormat(editor, type, value) {
    const mark = { type, data: { value } };
    const currentMarks = editor.findMarksByType(type);
    if (currentMarks.isEmpty()) editor.addMark(mark);
    else {
      currentMarks.forEach(oldMark => {
        editor.replaceMark(oldMark, mark);
      });
    }

    editor.focus();
  },
  toggleInlineFormat(editor, type) {
    editor.toggleMark(type).focus();
  },
  applyBlockFormat(editor, type, value) {
    const editorValue = editor.value;

    editorValue.blocks.forEach(block => {
      const blockFormats = block.data.get('formats') || {};
      editor.setNodeByKey(block.key, {
        type: block.type,
        data: { formats: { ...blockFormats, [type]: value } },
      });
    });

    editor.focus();
  },
};
