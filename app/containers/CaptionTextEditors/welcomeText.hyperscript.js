/** @jsx h */

import h from 'components/TextEditor/hyperscript';

export default (
  <value>
    <document>
      <paragraph formats={{ align: 'center' }}>
        <size value={24}>
          <weight value="700">Caption Creator</weight>
        </size>
      </paragraph>
      <paragraph />
      <paragraph>
        <weight value="700">Features</weight>
      </paragraph>
      <paragraph formats={{ textIndent: 1 }}>
        - Easily compose text and images with a variety of formatting options.
        Export your caption to a PNG image.
      </paragraph>
      <paragraph formats={{ textIndent: 1 }}>
        - Save/load as many captions as you want. Your current work is always
        autosaved.
      </paragraph>
      <paragraph formats={{ textIndent: 1 }}>
        - Installable and 100% offline compatible.
      </paragraph>
      <paragraph formats={{ textIndent: 1 }}>
        <color value="#ff0000">- No mobile support yet.</color>
      </paragraph>
      <paragraph />
      <paragraph>
        <weight value="700">Getting Started</weight>
      </paragraph>
      <paragraph formats={{ textIndent: 1 }}>
        - Hold right mouse to pan the caption.
      </paragraph>
      <paragraph formats={{ textIndent: 1 }}>
        - While holding right mouse, you can use the mouse wheel to zoom in and
        out.
      </paragraph>
      <paragraph formats={{ textIndent: 1 }}>
        - If you&#39;re using a trackpad, panning and zooming should work as
        expected.
      </paragraph>
      <paragraph formats={{ textIndent: 1 }}>
        - Select this text to edit it. To move the text box, press the control
        key (or toggle the button next to the X and Y inputs).
      </paragraph>
      <paragraph />
      <paragraph>
        <color value="#ff0000">
          <weight value="700">
            Caption Creator is currently in alpha, some known issues are:
          </weight>
        </color>
      </paragraph>
      <paragraph formats={{ textIndent: 1 }}>
        - Cursive fonts may render without conjoining letters.
      </paragraph>
      <paragraph formats={{ textIndent: 1 }}>
        - There is no support for transparent borders yet.
      </paragraph>
      <paragraph formats={{ textIndent: 1 }}>
        - Borders with rounded corners may not render correctly. Your safest
        option when using both these features together is to always apply them
        to every side.
      </paragraph>
      <paragraph formats={{ textIndent: 1 }}>
        <weight value="700">
          - Submit further issues from the [About] toolbar.
        </weight>
      </paragraph>
    </document>
  </value>
);
