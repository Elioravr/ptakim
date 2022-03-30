import {useState, useEffect} from 'react';
import useRandomList from './useRandomList';
import Petek from './Petek';

export default ({list, editPetek, deletePetek, random=false, ownerPics}) => {
    // const [listToDisplay, setListToDisplay] = useState([]);
    // useEffect(() => {
    //     const sortedList = Object.keys(list)
    //         .sort((a, b) => {
    //             if (random) {
    //                 // console.log('random!');
    //                 return 0.5 - Math.random();
    //             }

    //             // console.log('not random!');
    //             return (new Date(list[b].createdAt)) - (new Date(list[a].createdAt));
    //         });

    //     setListToDisplay(sortedList);
    // }, [random, list]);

    const [listToDisplay] = useRandomList(list, random);

    return (
        <div className="petek-list-container">
            {listToDisplay.map((petekKey, index) => {
                const ownerPic = ownerPics && list[petekKey] ? ownerPics[list[petekKey].owner] : null;
                return list[petekKey] && <Petek key={index} petek={{...list[petekKey], id: petekKey}} editPetek={editPetek} deletePetek={deletePetek} ownerPic={ownerPic} ownerPics={ownerPics} />
            })}
        </div>
    );
}
