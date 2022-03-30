import {useState, useEffect} from 'react';

export default (list, random) => {
    const [listToDisplay, setListToDisplay] = useState([]);
    useEffect(() => {
        const sortedList = Object.keys(list)
            .sort((a, b) => {
                if (random) {
                    // console.log('random!');
                    return 0.5 - Math.random();
                }

                // console.log('not random!');
                return (new Date(list[b].createdAt)) - (new Date(list[a].createdAt));
            });

        setListToDisplay(sortedList);
    }, [random, list]);

    return [listToDisplay];
}
