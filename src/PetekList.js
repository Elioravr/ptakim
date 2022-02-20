import Petek from './Petek';

export default () => {
    const x = [];
    for (let i=0; i<200; i++) {
        x.push('משהו מצחיק וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד וארוך מאוד מאוד ');
    }
    return (
        <div className="petek-list-container">
            {
                x.map(petek => <Petek petek={petek} />)
            }
        </div>
    );
}
