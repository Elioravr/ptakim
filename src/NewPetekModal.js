import {useState, useEffect} from 'react';

import Separator from './Separator';
import {addNewPetek} from './apiService';

export default ({isOpen, setIsOpen, list}) => {
    const [owner, setOwner] = useState('');
    const [content, setContent] = useState('');
    const [situation, setSituation] = useState('');
    const [allOwners, setAllOwners] = useState([]);
    const [allRelated, setAllRelated] = useState({});
    console.log('allRelated', allRelated);
    const className = `page new-petek-modal-container ${isOpen ? 'visible' : ''}`

    const clearForm = () => {
        setOwner('');
        setContent('');
        setSituation('');
    }

    useEffect(() => {
        const allOwners = Object.keys(list).reduce((result, currentPetekKey) => {
            const currentPetek = list[currentPetekKey];
            if (!result[currentPetek.owner]) {
                result[currentPetek.owner] = true;
            }

            return result;
        }, {});

        console.log('allOwners', allOwners);
        setAllOwners(allOwners);
    }, [list]);

    const handleSubmit = () => {
        const petek = {owner, content, situation, createdAt: (new Date()).toISOString()};
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
                <input value={situation} className="input" type="text" placeholder="באיזה סיטואציה?" onChange={createHandleChange('situation')} />

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

                <div className="add-new-petek-button" onClick={handleSubmit}>
                    🤦‍♂️ הוסף ציטוט 🤣
                </div>
            </div>
        </div>
    );
}
