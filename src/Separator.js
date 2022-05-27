// @flow

import type {MixedElement} from 'react';

import React from 'react';

export default function Separator({emoji}: {emoji: string}): MixedElement {
  return <div className="separator">{emoji}</div>;
}
