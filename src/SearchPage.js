import {useState, useEffect} from 'react';

import Separator from './Separator';

export default ({page, setPage, list}) => {
    const [freeTextFilter, setFreeTextFilter] = useState('');
    const [allOwners, setAllOwners] = useState({});
    const [allCategories, setAllCategories] = useState({});
    const [allRelated, setAllRelated] = useState({});
    const [owner, setOwner] = useState('');
    const className = `page modal search-page ${page === 'search' ? 'visible' : ''}`;

    useEffect(() => {
        const allOwners = Object.keys(list).reduce((result, currentPetekKey) => {
            const currentPetek = list[currentPetekKey];
            if (!result[currentPetek.owner]) {
                result[currentPetek.owner] = true;
            }

            return result;
        }, {});
        setAllOwners(allOwners);

        const allCategories = Object.keys(list).reduce((result, currentPetekKey) => {
            const currentPetek = list[currentPetekKey];
            if (currentPetek.category && !result[currentPetek.category] ) {
                result[currentPetek.category] = true;
            }

            return result;
        }, {});
        setAllCategories(allCategories);
    }, [list]);

    const handleClose = () => {
        setPage('app');
    };

    const handleSubmit = () => {
        setPage('app');
    }

    return (
        <div className={className}>
            <div className="page-header">
                <span>חפש פתק</span>
                <div onClick={handleClose}>X</div>
            </div>
            <div className="modal-body">
                <input value={freeTextFilter} className="input" type="text" placeholder="טקסט חופשי לחיפוש" onChange={() => {}}/>
                <Separator emoji="🔍" />

                <div className="owners-list-container">
                    {Object.keys(allOwners).map((currOwner, index) => {
                        const className = `set-owner-button ${currOwner === owner ? 'selected' : ''}`;
                        return <div key={index} className={className}>{currOwner}</div>
                    })}
                </div>

                <Separator emoji="🤣" />

                <div className="section-container relation-container">
                    <div className="title">קשור למישהו?</div>
                    <div className="related-list-container">
                        {Object.keys(allOwners).map((owner, index) => {
                            const className = `set-related-button ${allRelated[owner] ? 'selected' : ''}`;
                            return <div key={index} className={className}>{owner}</div>
                        })}
                    </div>
                </div>

                <Separator emoji="🤪" />

                <div className="add-new-petek-button" onClick={handleSubmit}>
                    🤦‍♂️ חפש 🤣
                </div>
            </div>
        </div>
    );
}
