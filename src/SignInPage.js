import {useState} from 'react';

import Separator from './Separator';
import MainButton from './MainButton';
import Loading from './Loading';
import {createUserWithPhoneNumber, verifyCode} from './apiService';

const PHONE_STAGE = 'phone_stage';
const CODE_STAGE = 'code_stage';

export default ({page, setPage}) => {
    const [phoneNumber, setPhoneNumber] = useState('0545405558');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [stage, setStage] = useState(PHONE_STAGE);
    const [enableErrorMessage, setEnableErrorMessage] = useState(false);

    const className = `page modal sign-in-page ${page === 'sign-in' ? 'visible' : ''}`;

    const handleClose = () => {
        setPage('app');
    };

    const handlePhoneNumberInputChange = (e) => {
        setPhoneNumber(e.target.value);
    }

    const handleCodeInputChange = (e) => {
        setCode(e.target.value);
    }

    const handleSignInClick = () => {
        setIsLoading(true);
        if (stage === PHONE_STAGE) {
            createUserWithPhoneNumber(phoneNumber).then((confirmationResult) => {
                setIsLoading(false);
                setStage(CODE_STAGE);
            });
        } else if (stage === CODE_STAGE) {
            verifyCode(code).then(user => {
                setIsLoading(false);
                setPage('app');

                setPhoneNumber('');
                setCode('');
                setStage(PHONE_STAGE);
                setEnableErrorMessage(false);
            }).catch(e => {
                setIsLoading(false);
                setCode('');
                setEnableErrorMessage(true);
            });
        }
    }

    return (
        <div className={className}>
            <div className="page-header">
                <span>התחברות</span>
                <div onClick={handleClose}>x</div>
            </div>

            {page === 'sign-in' &&
                <div className="modal-body">
                    <div className="section-container">
                        <div className="title">
                            <span>{`התחבר לפתקים`}</span>
                        </div>
                        <Separator emoji={"☎️"} />

                        {stage === PHONE_STAGE ?
                            <input value={phoneNumber} className="input" type="text" placeholder="מספר טלפון" onChange={handlePhoneNumberInputChange} />
                            :
                            <input value={code} className="input" type="text" placeholder="מה הקוד שקיבלת?" onChange={handleCodeInputChange} />
                        }
                        {enableErrorMessage && <div className="error-message">בטוח שהזנת קוד נכון? נסה/י שוב!</div>}
                        {isLoading ?
                            <Loading text={stage === PHONE_STAGE ? "שולח הודעה..." : "בודק את הקוד..."} />
                            :
                            <MainButton content={stage === PHONE_STAGE ? "שלח הודעה" : "התחבר"} onClick={handleSignInClick} />
                        }
                    </div>
                </div>
            }
        </div>
    )
}
