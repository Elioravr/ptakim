import {useState, useEffect} from 'react';

import Separator from './Separator';

export default ({page, setPage, list}) => {
    const [freeTextFilter, setFreeTextFilter] = useState('');
    const [allOwners, setAllOwners] = useState({});
    const [allCategories, setAllCategories] = useState({});
    const [allRelated, setAllRelated] = useState({});
    const [owner, setOwner] = useState('');
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState(4);
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

                <div className="section-container">
                    <div className="title">מי אמר?</div>
                    <div className="owners-list-container">
                    {Object.keys(allOwners).map((currOwner, index) => {
                        const className = `set-owner-button ${currOwner === owner ? 'selected' : ''}`;
                        return <div key={index} className={className}>{currOwner}</div>
                    })}
                    </div>
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

                <Separator emoji="✍️" />

                <div className="section-container rating-container">
                    <div className="title">{`רק ${rating} כוכבים ומעלה`}</div>
                    <div className="stars-container">
                        <div className={`star star-1 ${rating >= 1 ? 'selected' : ''}`}></div>
                        <div className={`star star-2 ${rating >= 2 ? 'selected' : ''}`}></div>
                        <div className={`star star-3 ${rating >= 3 ? 'selected' : ''}`}></div>
                        <div className={`star star-4 ${rating >= 4 ? 'selected' : ''}`}></div>
                        <div className={`star star-5 ${rating >= 5 ? 'selected' : ''}`}></div>
                    </div>
                </div>

                <Separator emoji="🤭" />

                <div className="section-container">
                    <div className="title">קטגוריה?</div>
                    <input value={category} className="input" type="text" placeholder="כתוב או בחר קטגוריה" />
                    <div className="owners-list-container">
                        {Object.keys(allCategories).map((currCategory, index) => {
                            const className = `category-tag ${currCategory === category ? 'selected' : ''}`;
                            return <div key={index} className={className}>{currCategory}</div>
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
