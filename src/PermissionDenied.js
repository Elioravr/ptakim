import {useEffect, useState} from 'react';

export default ({isOpen, setIsOpen}) => {
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                setIsOpen(false);
            }, 2000);
        }
    }, [isOpen, setIsOpen]);

    return (
        <div className={`permission-modal-overlay ${isOpen ? 'visible' : ''}`}>
            <div className="modal">
                <div>אין לך הרשאות לבצע את הפעולה הזאת</div>
                <div className="emoji">{"🤷‍♂️"}</div>
            </div>
        </div>
    );
}
