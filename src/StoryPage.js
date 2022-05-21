import { useState, useRef, useEffect } from "react";
import useRandomList from "./useRandomList";
import usePrevious from "use-previous";
import Petek from "./Petek";

const NO_OWNER_PIC_PLACEHOLDER =
  "https://erasmuscoursescroatia.com/wp-content/uploads/2015/11/no-user.jpg";
const LINE_BREAKS_LIMIT_FOR_SCALE_DOWN = 6;
const STORY_LENGTH = 10;
let currentSetTimeoutId = null;

export default ({ page, setPage, list, ownerPics }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const backgroundRef = useRef(null);
  const [listToDisplay] = useRandomList(list, true);
  const prevIndex = usePrevious(currentIndex);
  const className = `page modal story-page ${
    page === "story" ? "visible" : ""
  }`;

  const handleClose = () => {
    setPage("app");
  };

  useEffect(() => {
    clearTimeout(currentSetTimeoutId);

    currentSetTimeoutId = setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
    }, STORY_LENGTH * 1000);
  }, [currentIndex, page]);

  if (list == null || ownerPics == null) {
    return null;
  }

  const petekKey = listToDisplay[Object.keys(listToDisplay)[currentIndex]];
  const currentOwner = list[petekKey].owner;
  const ownerPic = ownerPics[currentOwner];
  const enableScaleDown =
    list[petekKey].content.split("\n").length >
    LINE_BREAKS_LIMIT_FOR_SCALE_DOWN;

  return (
    <div className={className}>
      <div
        className="story-background"
        style={{ backgroundImage: `url(${ownerPic})` }}
        ref={backgroundRef}
      ></div>
      <div className="page-header">
        <span className="title">
          <div className="picture">
            <img src={ownerPic || NO_OWNER_PIC_PLACEHOLDER} />
          </div>
          <div className="owner-name">{currentOwner}</div>
        </span>
        <div className="close-button" onClick={handleClose}>
          x
        </div>
      </div>
      <div className="story-length" key={petekKey}>
        <div className="length"></div>
      </div>
      {Object.keys(list).map((key) => {
        return (
          <Petek
            key={`petek-${key}`}
            petek={{ ...list[petekKey], id: petekKey }}
            editPetek={null}
            deletePetek={null}
            ownerPic={ownerPic}
            ownerPics={ownerPics}
            enableScaleDown={enableScaleDown}
            isHidden={key !== petekKey}
          />
        );
      })}
      <div
        className="story-button next-button"
        onClick={() =>
          setCurrentIndex(
            currentIndex === Object.keys(list).length - 1 ? 0 : currentIndex + 1
          )
        }
      ></div>
      <div
        className="story-button prev-button"
        onClick={() =>
          setCurrentIndex(currentIndex === 0 ? 0 : currentIndex - 1)
        }
      ></div>
    </div>
  );
};
