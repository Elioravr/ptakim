// @flow
import React, {useState} from 'react';

import Separator from './Separator';
import MainButton from './MainButton';
import Loading from './Loading';
import {createUserWithPhoneNumber, verifyCode} from './apiService';
import type {MixedElement} from 'react';
import type {PageType} from './AppTypes.flow';

const PHONE_STAGE = 'phone_stage';
const CODE_STAGE = 'code_stage';

type SigninPageStage = 'phone_stage' | 'code_stage';

type Props = $ReadOnly<{
  page: PageType,
  setPage: (PageType) => void,
}>;

export default function SigninPage({page, setPage}: Props): MixedElement {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stage, setStage] = useState<SigninPageStage>(PHONE_STAGE);
  const [enableErrorMessage, setEnableErrorMessage] = useState<boolean>(false);

  const className = `page modal sign-in-page ${
    page === 'sign-in' ? 'visible' : ''
  }`;

  const handleClose = () => {
    setPhoneNumber('');
    setCode('');
    setStage(PHONE_STAGE);
    setEnableErrorMessage(false);

    setPage('app');
  };

  const handlePhoneNumberInputChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleCodeInputChange = (e) => {
    setCode(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSignInClick = () => {
    setIsLoading(true);
    if (stage === PHONE_STAGE) {
      createUserWithPhoneNumber(phoneNumber).then(() => {
        setIsLoading(false);
        setStage(CODE_STAGE);
      });
    } else if (stage === CODE_STAGE) {
      verifyCode(code, name)
        .then(() => {
          setIsLoading(false);
          setPage('app');

          setPhoneNumber('');
          setCode('');
          setStage(PHONE_STAGE);
          setEnableErrorMessage(false);
        })
        .catch(() => {
          setIsLoading(false);
          setCode('');
          setEnableErrorMessage(true);
        });
    }
  };

  return (
    <div className={className}>
      <div className="page-header">
        <span>התחברות</span>
        <div onClick={handleClose}>x</div>
      </div>

      {page === 'sign-in' && (
        <div className="modal-body">
          <div className="section-container">
            <div className="title">
              <span>{`התחבר לפתקים`}</span>
            </div>
            <Separator emoji={'☎️'} />

            <input
              value={name}
              className="input"
              type="text"
              placeholder="שם מלא"
              onChange={handleNameChange}
            />
            {stage === PHONE_STAGE ? (
              <>
                <input
                  value={phoneNumber}
                  className="input"
                  type="text"
                  placeholder="מספר טלפון"
                  onChange={handlePhoneNumberInputChange}
                />
              </>
            ) : (
              <input
                value={code}
                className="input"
                type="text"
                placeholder="מה הקוד שקיבלת?"
                onChange={handleCodeInputChange}
              />
            )}
            {enableErrorMessage && (
              <div className="error-message">
                בטוח שהזנת קוד נכון? נסה/י שוב!
              </div>
            )}
            {isLoading ? (
              <Loading
                text={
                  stage === PHONE_STAGE ? 'שולח הודעה...' : 'בודק את הקוד...'
                }
              />
            ) : (
              <MainButton
                content={stage === PHONE_STAGE ? 'שלח הודעה' : 'התחבר'}
                onClick={handleSignInClick}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
