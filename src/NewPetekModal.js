import {useState, useEffect} from 'react';

import Separator from './Separator';
import {addNewPetek} from './apiService';

export default ({isOpen, setIsOpen, list, petekToEdit}) => {
    const [owner, setOwner] = useState('');
    const [content, setContent] = useState('');
    const [situation, setSituation] = useState('');
    const [allOwners, setAllOwners] = useState([]);
    const [allRelated, setAllRelated] = useState({});
    const [rating, setRating] = useState(0);
    const className = `page new-petek-modal-container ${isOpen ? 'visible' : ''}`

    const clearForm = () => {
        setOwner('');
        setContent('');
        setSituation('');
        setRating(0);
    }

    useEffect(() => {
        const allOwners = Object.keys(list).reduce((result, currentPetekKey) => {
            const currentPetek = list[currentPetekKey];
            if (!result[currentPetek.owner]) {
                result[currentPetek.owner] = true;
            }

            return result;
        }, {});

        setAllOwners(allOwners);
    }, [list]);

    useEffect(() => {
        if (!petekToEdit) {
            return;
        }

        setOwner(petekToEdit.owner ?? '');
        setContent(petekToEdit.content ?? '');
        setSituation(petekToEdit.situation ?? '');
        setRating(petekToEdit.rating ?? 0);
        setAllRelated(petekToEdit.allRelated ?? {});
    }, [petekToEdit]);

    const handleSubmit = () => {
        const petek = {
            id: petekToEdit?.id ?? null,
            owner,
            content,
            situation,
            rating,
            allRelated: Object.keys(allRelated).length === 0 ? null : allRelated,
            createdAt: petekToEdit?.createdAt ?? (new Date()).toISOString()
        };

        clearForm();
        addNewPetek(petek);
        setIsOpen(false);
    }

    const handleClose = () => {
        clearForm();
        setIsOpen(false);
    }

    const createHandleChange = (fieldName) => {
        return (e) => {
            switch (fieldName) {
                case 'owner': {
                    setOwner(e.target.value);
                    break;
                }
                case 'content': {
                    setContent(e.target.value);
                    break;
                }
                case 'situation': {
                    setSituation(e.target.value);
                    break;
                }
            }
        }
    }

    const createHandleOwnerClick = (newOwnerFromButton) => {
        return () => {
            if (owner === newOwnerFromButton) {
                setOwner('');
            }

            setOwner(newOwnerFromButton);
        }
    }

    const createHandleRelatedClick = (related) => {
        return () => {
            const newRelated = {...allRelated};
            if (newRelated[related]) {
                Reflect.deleteProperty(newRelated, related);
            } else {
                newRelated[related] = true;
            }

            setAllRelated(newRelated);
        }
    }

    const createHandleRatingClick = (selectedRating) => {
        return () => {
            setRating(selectedRating);
        }
    }

    return (
        <div className={className}>
            <div className="modal-header">
                <span>הוסף פתק</span>
                <div onClick={handleClose}>X</div>
            </div>
            <div className="modal-body">
                <input value={owner} className="input" type="text" placeholder="מי אמר?" onChange={createHandleChange('owner')} />
                <div className="owners-list-container">
                    {Object.keys(allOwners).map((currOwner, index) => {
                        const className = `set-owner-button ${currOwner === owner ? 'selected' : ''}`;
                        return <div key={index} className={className} onClick={createHandleOwnerClick(currOwner)}>{currOwner}</div>
                    })}
                </div>

                <Separator emoji="🤣" />

                <textarea value={content} className="input long-input" placeholder="מה אמרו?" onChange={createHandleChange('content')} />
                <textarea value={situation} className="input long-input" type="text" placeholder="באיזה סיטואציה?" onChange={createHandleChange('situation')} />

                <Separator emoji="🤦‍♂️" />

                <div className="relation-container">
                    <div className="title">קשור למישהו?</div>
                    <div className="related-list-container">
                        {Object.keys(allOwners).map((owner, index) => {
                            const className = `set-related-button ${allRelated[owner] ? 'selected' : ''}`;
                            return <div key={index} className={className} onClick={createHandleRelatedClick(owner)}>{owner}</div>
                        })}
                    </div>
                </div>

                <Separator emoji="🤪" />

                <div className="rating-container">
                    <div className="title">כמה זה טוב?</div>
                    <div className="stars-container">
                        <div className={`star star-1 ${rating >= 1 ? 'selected' : ''}`} onClick={createHandleRatingClick(1)}></div>
                        <div className={`star star-2 ${rating >= 2 ? 'selected' : ''}`} onClick={createHandleRatingClick(2)}></div>
                        <div className={`star star-3 ${rating >= 3 ? 'selected' : ''}`} onClick={createHandleRatingClick(3)}></div>
                        <div className={`star star-4 ${rating >= 4 ? 'selected' : ''}`} onClick={createHandleRatingClick(4)}></div>
                        <div className={`star star-5 ${rating >= 5 ? 'selected' : ''}`} onClick={createHandleRatingClick(5)}></div>
                    </div>
                </div>

                <Separator emoji="🙊" />

                <div className="add-new-petek-button" onClick={handleSubmit}>
                    🤦‍♂️ הוסף ציטוט 🤣
                </div>
            </div>
        </div>
    );
}
