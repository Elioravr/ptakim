import Petek from './Petek';
import {fetchPetekList} from './apiService'

export default () => {
    const x = [];
    for (let i=0; i<200; i++) {
        x.push('משהו מצחיק וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד ');
    }
    return (
        <div className="petek-list-container">
            {x.map((petek, index) => <Petek key={index} petek={petek} />)}
        </div>
    );
}
