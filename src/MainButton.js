// @flow

import type {MixedElement} from 'react';

import React from 'react';

type Props = $ReadOnly<{
  onClick: () => void,
  content: string,
}>;

export default function MainButton({onClick, content}: Props): MixedElement {
  return (
    <div className="main-submit-button" onClick={onClick}>
      {content}
    </div>
  );
}
