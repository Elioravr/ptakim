import {useState, useRef, useEffect} from 'react';
import useRandomList from './useRandomList';
import Petek from './Petek';

const LINE_BREAKS_LIMIT_FOR_SCALE_DOWN = 6;

export default ({page, setPage, list, ownerPics}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const backgroundRef = useRef(null);
    const [listToDisplay] = useRandomList(list, true);
    const className = `page modal story-page ${page === 'story' ? 'visible' : ''}`;

    const handleClose = () => {
        setPage('app');
    };

    if (list == null || ownerPics == null) {
        return null;
    }

    const petekKey = listToDisplay[Object.keys(listToDisplay)[currentIndex]];
    const currentOwner = list[petekKey].owner;
    const ownerPic = ownerPics[currentOwner];
    const enableScaleDown = list[petekKey].content.split('\n').length > LINE_BREAKS_LIMIT_FOR_SCALE_DOWN;

    return (
        <div className={className}>
            <div className="story-background" style={{backgroundImage: `url(${ownerPic})`}} ref={backgroundRef}></div>
            <div className="page-header">
                <span className="hidden-title">סטורי</span>
                <div className="close-button" onClick={handleClose}>x</div>
            </div>
            {Object.keys(list).map((key) => {
                return (
                    <Petek
                        key={`petek-${key}`}
                        petek={{...list[petekKey], id: petekKey}}
                        editPetek={null}
                        deletePetek={null}
                        ownerPic={ownerPic}
                        ownerPics={ownerPics}
                        enableScaleDown={enableScaleDown}
                        isHidden={key !== petekKey}
                    />
                );
            })}
            <div className="story-button next-button" onClick={() => setCurrentIndex(currentIndex + 1)}></div>
            <div className="story-button prev-button" onClick={() => setCurrentIndex(currentIndex - 1)}></div>
        </div>
    );
}
