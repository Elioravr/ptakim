import {useState} from 'react';

import {addNewPetek} from './apiService';

export default ({isOpen}) => {
    const [owner, setOwner] = useState('');
    const [content, setContent] = useState('');
    const className = `new-petek-modal-container ${isOpen ? 'visible' : ''}`

    const handleSubmit = () => {
        const petek = {owner, content, createdAt: (new Date()).toISOString()};
        addNewPetek(petek);
    }

    const createHandleChange = (fieldName) => {
        return (e) => {
            console.log('e.target.value', e.target.value);
            switch (fieldName) {
                case 'owner': {
                    setOwner(e.target.value);
                    break;
                }
                case 'content': {
                    setContent(e.target.value);
                    break;
                }
            }
        }
    }

    return (
        <div className={className}>
            <input type="text" placeholder="מי אמר?" onChange={createHandleChange('owner')} />
            <input type="text" placeholder="מה אמרו?" onChange={createHandleChange('content')} />
            <button onClick={handleSubmit}>הזן</button>
        </div>
    );
}
