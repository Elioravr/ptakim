import {useState} from 'react';
import Petek from './Petek';

export default ({list, editPetek, deletePetek, random=false}) => {
    const sortedList = Object.keys(list)
        .sort((a, b) => {
            if (random) {
                return 0.5 - Math.random();
            }

            return (new Date(list[b].createdAt)) - (new Date(list[a].createdAt));
        });

    return (
        <div className="petek-list-container">
            {sortedList.map((petekKey, index) => <Petek key={index} petek={{...list[petekKey], id: petekKey}} editPetek={editPetek} deletePetek={deletePetek} />)}
        </div>
    );
}
