import {useState, useEffect} from 'react';

export default function useRandomList(list, random) {
  const [listToDisplay, setListToDisplay] = useState([]);
  useEffect(() => {
    const sortedList = Object.keys(list).sort((a, b) => {
      if (random) {
        return 0.5 - Math.random();
      }

      return new Date(list[b].createdAt) - new Date(list[a].createdAt);
    });

    setListToDisplay(sortedList);
  }, [random, list]);

  return [listToDisplay];
}
