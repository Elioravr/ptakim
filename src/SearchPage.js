import {useState, useEffect, useRef} from 'react';

import Separator from './Separator';

export default ({page, setPage, list, setFilteredList}) => {
    const [freeTextFilter, setFreeTextFilter] = useState('');
    const [allOwners, setAllOwners] = useState({});
    const [allCategories, setAllCategories] = useState({});
    const [allRelated, setAllRelated] = useState({});
    const [owner, setOwner] = useState('');
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState(4);
    const pageRef = useRef(null);
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

    useEffect(() => {
        if (page === 'search') {
            pageRef?.current?.scrollTo(0, 0);
        }
    }, [page]);

    const handleClose = () => {
        setPage('app');
    };

    const search = () => {
        let result = {...list};

        // Free text search
        if (freeTextFilter) {
            result = Object.keys(list).reduce((filtered, currentPetekKey) => {
                const currentPetek = list[currentPetekKey];

                if (currentPetek.content?.includes(freeTextFilter) ||
                    currentPetek.category?.includes(freeTextFilter) ||
                    currentPetek.owner?.includes(freeTextFilter) ||
                    currentPetek.related?.includes(freeTextFilter) ||
                    currentPetek.situation?.includes(freeTextFilter)) {
                    filtered[currentPetekKey] = currentPetek;
                }

                return filtered;
            }, {});
        }

        // Owner
        if (owner) {
            result = Object.keys(result).reduce((filtered, currentPetekKey) => {
                const currentPetek = list[currentPetekKey];

                if (currentPetek?.owner === owner) {
                    filtered[currentPetekKey] = currentPetek;
                }

                return filtered;
            }, {});
        }

        // Category
        if (category) {
            result = Object.keys(result).reduce((filtered, currentPetekKey) => {
                const currentPetek = list[currentPetekKey];

                if (currentPetek?.category === category) {
                    filtered[currentPetekKey] = currentPetek;
                }

                return filtered;
            }, {});
        }

        setFilteredList(result);
    }

    const handleSubmit = () => {
        search();
        setPage('app');
    }

    const handleFreeTextFilterChange = (e) => {
        setFreeTextFilter(e.target.value);
    }

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    }

    const createHandleCategoryClick = (selected) => {
        return () => {
            setCategory(selected);
        }
    }

    const createHandleOwnerClick = (selected) => {
        return () => {
            setOwner(selected)
        }
    }

    return (
        <div className={className} ref={pageRef}>
            <div className="page-header">
                <span>חפש פתק</span>
                <div onClick={handleClose}>X</div>
            </div>
            <div className="modal-body">
                <input value={freeTextFilter} className="input" type="text" placeholder="טקסט חופשי לחיפוש" onChange={handleFreeTextFilterChange}/>
                <Separator emoji="🔍" />

                <div className="section-container">
                    <div className="title">מי אמר?</div>
                    <div className="owners-list-container">
                    {Object.keys(allOwners).map((currOwner, index) => {
                        const className = `set-owner-button ${currOwner === owner ? 'selected' : ''}`;
                        return <div key={index} className={className} onClick={createHandleOwnerClick(currOwner)}>{currOwner}</div>
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
                    <div className="category-input-container">
                        <input value={category} className="input" type="text" placeholder="כתוב או בחר קטגוריה" onChange={handleCategoryChange} />
                        <div className="clear-category-text" onClick={() => {setCategory('')}}>x</div>
                    </div>
                    <div className="owners-list-container">
                        {Object.keys(allCategories).filter(currCategory => {
                            return !category || currCategory.includes(category);
                        }).map((currCategory, index) => {
                            const className = `category-tag ${currCategory === category ? 'selected' : ''}`;
                            return <div key={index} className={className} onClick={createHandleCategoryClick(currCategory)}>{currCategory}</div>
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
