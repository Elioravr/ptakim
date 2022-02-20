import {useState} from 'react';
import Petek from './Petek';

export default ({list}) => {
    return (
        <div className="petek-list-container">
            {Object.keys(list).map((petekKey, index) => <Petek key={index} petek={list[petekKey]} />)}
        </div>
    );
}
