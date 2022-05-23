// @flow

import type {MixedElement} from 'react';
import React, {useState, useEffect} from 'react';

type Props = $ReadOnly<{
  text?: string,
  loadingSize?: 'small' | 'large',
}>;

let intervalId;
export default function Loading({
  text = 'טוען פאדיחות...',
  loadingSize = 'large',
}: Props): MixedElement {
  const icons = ['🙊', '🤣', '🤦‍♂️', '🤓', '🤷‍♂️'];
  const [currentStage, setCurrentStage] = useState<number>(0);

  useEffect(() => {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      let nextStage = currentStage + 1;

      if (nextStage === icons.length) {
        nextStage = 0;
      }

      setCurrentStage(nextStage);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  });

  return (
    <div className={`loading-container ${loadingSize}`}>
      {icons.map((icon, index) =>
        currentStage === index ? (
          <div key={index} className="stage">
            {icon}
          </div>
        ) : null,
      )}
      <span className="text">{text}</span>
    </div>
  );
}
