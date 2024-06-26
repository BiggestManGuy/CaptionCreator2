/** @jsx h */

import h from 'components/TextEditor/hyperscript';

export default function generateDefaultText(text) {
  return (
    <value>
      <document>
        <paragraph formats={{ align: 'center' }}>{text}</paragraph>
      </document>
    </value>
  );
}
