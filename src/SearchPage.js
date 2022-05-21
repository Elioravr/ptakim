import { useState, useEffect, useRef } from "react";

import Separator from "./Separator";

const RATING_SEARCH_TYPE_AND_ABOVE = "and_above";
const RATING_SEARCH_TYPE_ONLY = "only";

export default ({
  page,
  setPage,
  list,
  setFilteredList,
  filteredList,
  setOwnerFilterHeader,
}) => {
  const [freeTextFilter, setFreeTextFilter] = useState("");
  const [allOwners, setAllOwners] = useState({});
  const [allCategories, setAllCategories] = useState({});
  const [allRelated, setAllRelated] = useState({});
  const [owner, setOwner] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingSearchType, setRatingSearchType] = useState(
    RATING_SEARCH_TYPE_AND_ABOVE
  );
  const pageRef = useRef(null);
  const summaryRef = useRef(null);
  const submitButtonRef = useRef(null);
  const className = `page modal search-page ${
    page === "search" ? "visible" : ""
  }`;

  const isFilteredBySomething =
    freeTextFilter !== "" ||
    owner !== "" ||
    category !== "" ||
    Object.keys(allRelated).length !== 0 ||
    rating !== 0;

  const clearAllFilters = () => {
    setFreeTextFilter("");
    setOwner("");
    setCategory("");
    setAllRelated({});
    setRating(0);
    setRatingSearchType(RATING_SEARCH_TYPE_AND_ABOVE);

    setFilteredList(null);
  };

  useEffect(() => {
    // Reset search in case the list changes (on edit for example)
    if (isFilteredBySomething) {
      search();
    }

    const allOwners = Object.keys(list).reduce((result, currentPetekKey) => {
      const currentPetek = list[currentPetekKey];
      if (!result[currentPetek.owner]) {
        result[currentPetek.owner] = true;
      }

      return result;
    }, {});
    setAllOwners(allOwners);

    const allCategories = Object.keys(list).reduce(
      (result, currentPetekKey) => {
        const currentPetek = list[currentPetekKey];
        if (currentPetek.category && !result[currentPetek.category]) {
          result[currentPetek.category] = true;
        }

        return result;
      },
      {}
    );
    setAllCategories(allCategories);
  }, [list]);

  useEffect(() => {
    let submitButtonPaddingBottom = 0;
    if (isFilteredBySomething) {
      submitButtonPaddingBottom =
        summaryRef.current.getBoundingClientRect().height +
        submitButtonRef.current.getBoundingClientRect().height;
    }

    pageRef.current.style = `padding-bottom: ${
      submitButtonPaddingBottom + 35
    }px`;
  }, [freeTextFilter, owner, category, allRelated, rating]);

  useEffect(() => {
    if (page === "search") {
      pageRef?.current?.scrollTo(0, 0);
    }
  }, [page]);

  // Used to clear all filters after clearing the filters from outside
  useEffect(() => {
    if (filteredList === null) {
      clearAllFilters();
    }
  }, [filteredList]);

  const handleClose = () => {
    setPage("app");
  };

  const search = () => {
    let result = { ...list };

    // Free text search
    if (freeTextFilter) {
      result = Object.keys(list).reduce((filtered, currentPetekKey) => {
        const currentPetek = list[currentPetekKey];

        if (
          currentPetek.content?.includes(freeTextFilter) ||
          currentPetek.category?.includes(freeTextFilter) ||
          currentPetek.owner?.includes(freeTextFilter) ||
          currentPetek.related?.includes(freeTextFilter) ||
          currentPetek.situation?.includes(freeTextFilter)
        ) {
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

    // Related
    if (allRelated) {
      result = Object.keys(result).reduce((filtered, currentPetekKey) => {
        const currentPetek = list[currentPetekKey];

        if (
          Object.keys(allRelated).every(
            (related) =>
              currentPetek?.allRelated &&
              Object.keys(currentPetek?.allRelated).includes(related)
          )
        ) {
          filtered[currentPetekKey] = currentPetek;
        }

        return filtered;
      }, {});
    }

    // Rating
    if (rating !== 0) {
      result = Object.keys(result).reduce((filtered, currentPetekKey) => {
        const currentPetek = list[currentPetekKey];
        const isInRating =
          ratingSearchType === RATING_SEARCH_TYPE_AND_ABOVE
            ? currentPetek.rating >= rating
            : currentPetek.rating === rating;

        if (currentPetek?.rating != null && isInRating) {
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
    setOwnerFilterHeader(owner, { overrideList: false });
  };

  const handleSubmit = () => {
    search();
    setPage("app");
  };

  const handleFreeTextFilterChange = (e) => {
    setFreeTextFilter(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const createHandleCategoryClick = (selected) => {
    return () => {
      setCategory(selected);
    };
  };

  const createHandleOwnerClick = (selected) => {
    return () => {
      if (selected === owner) {
        return setOwner("");
      }

      setOwner(selected);
    };
  };

  const createHandleRelatedClick = (selected) => {
    return () => {
      if (allRelated[selected]) {
        const newRelated = { ...allRelated };
        Reflect.deleteProperty(newRelated, selected);
        setAllRelated(newRelated);
      } else {
        setAllRelated({ ...allRelated, [selected]: true });
      }
    };
  };

  const createHandleRatingClick = (selectedRating) => {
    return () => {
      if (selectedRating === rating) {
        return setRating(0);
      }

      setRating(selectedRating);
    };
  };

  const createHandleRatingSearchTypeClick = (ratingSearchType) => {
    return () => {
      setRatingSearchType(ratingSearchType);
    };
  };

  return (
    <div className={className} ref={pageRef}>
      <div className="page-header">
        <span>חפש פתק</span>
        <div onClick={handleClose}>x</div>
      </div>
      <div className="modal-body">
        <input
          value={freeTextFilter}
          className="input"
          type="text"
          placeholder="טקסט חופשי לחיפוש"
          onChange={handleFreeTextFilterChange}
        />
        <Separator emoji="🔍" />

        <div className="section-container">
          <div className="title">מי אמר?</div>
          <div className="owners-list-container">
            {Object.keys(allOwners).map((currOwner, index) => {
              const className = `set-owner-button ${
                currOwner === owner ? "selected" : ""
              }`;
              return (
                <div
                  key={index}
                  className={className}
                  onClick={createHandleOwnerClick(currOwner)}
                >
                  {currOwner}
                </div>
              );
            })}
          </div>
        </div>

        <Separator emoji="🤣" />

        <div className="section-container relation-container">
          <div className="title">קשור למישהו?</div>
          <div className="related-list-container">
            {Object.keys(allOwners).map((currRelated, index) => {
              const className = `set-related-button ${
                allRelated[currRelated] ? "selected" : ""
              }`;
              return (
                <div
                  key={index}
                  className={className}
                  onClick={createHandleRelatedClick(currRelated)}
                >
                  {currRelated}
                </div>
              );
            })}
          </div>
        </div>

        <Separator emoji="✍️" />

        <div className="section-container rating-container">
          <div className="title">
            {rating === 0
              ? "כל הפתקים בלי דירוג"
              : `רק ${rating} כוכבים ${
                  ratingSearchType === RATING_SEARCH_TYPE_AND_ABOVE
                    ? "ומעלה"
                    : ""
                }`}
          </div>
          <div className="stars-container">
            <div
              className={`star star-1 ${rating >= 1 ? "selected" : ""}`}
              onClick={createHandleRatingClick(1)}
            ></div>
            <div
              className={`star star-2 ${rating >= 2 ? "selected" : ""}`}
              onClick={createHandleRatingClick(2)}
            ></div>
            <div
              className={`star star-3 ${rating >= 3 ? "selected" : ""}`}
              onClick={createHandleRatingClick(3)}
            ></div>
            <div
              className={`star star-4 ${rating >= 4 ? "selected" : ""}`}
              onClick={createHandleRatingClick(4)}
            ></div>
            <div
              className={`star star-5 ${rating >= 5 ? "selected" : ""}`}
              onClick={createHandleRatingClick(5)}
            ></div>
          </div>
          <div className="rating-search-type-container">
            <div
              className={`search-type-button option-1 ${
                ratingSearchType === RATING_SEARCH_TYPE_AND_ABOVE
                  ? "selected"
                  : ""
              }`}
              onClick={createHandleRatingSearchTypeClick(
                RATING_SEARCH_TYPE_AND_ABOVE
              )}
            >
              ומעלה
            </div>
            <div
              className={`search-type-button option-2 ${
                ratingSearchType === RATING_SEARCH_TYPE_ONLY ? "selected" : ""
              }`}
              onClick={createHandleRatingSearchTypeClick(
                RATING_SEARCH_TYPE_ONLY
              )}
            >
              רק
            </div>
          </div>
        </div>

        <Separator emoji="🤭" />

        <div className="section-container">
          <div className="title">קטגוריה?</div>
          <div className="category-input-container">
            <input
              value={category}
              className="input"
              type="text"
              placeholder="כתוב או בחר קטגוריה"
              onChange={handleCategoryChange}
            />
            <div
              className="clear-category-text"
              onClick={() => {
                setCategory("");
              }}
            >
              x
            </div>
          </div>
          <div className="owners-list-container">
            {Object.keys(allCategories)
              .filter((currCategory) => {
                return !category || currCategory.includes(category);
              })
              .map((currCategory, index) => {
                const className = `category-tag ${
                  currCategory === category ? "selected" : ""
                }`;
                return (
                  <div
                    key={index}
                    className={className}
                    onClick={createHandleCategoryClick(currCategory)}
                  >
                    {currCategory}
                  </div>
                );
              })}
          </div>
        </div>

        <Separator emoji="🤪" />

        <div
          className={`main-submit-button filter-button ${
            isFilteredBySomething ? "has-filter" : ""
          }`}
          onClick={handleSubmit}
          ref={submitButtonRef}
        >
          🤦‍♂️ חפש 🤣
        </div>

        <div
          className={`filter-summary-container ${
            isFilteredBySomething ? "visible" : ""
          }`}
          ref={summaryRef}
        >
          <div className="summary">
            <b>סינון לפי:</b>
            {freeTextFilter !== "" && (
              <div>
                {"✏️ טקסט חופשי: "} <span>{freeTextFilter}</span>
              </div>
            )}
            {owner !== "" && (
              <div>
                {"🙊 מי אמר: "}
                <span>{owner}</span>
              </div>
            )}
            {Object.keys(allRelated).length !== 0 && (
              <div>
                {"🧬 קשור למישהו: "}
                <span>{Object.keys(allRelated).join(", ")}</span>
              </div>
            )}
            {rating !== 0 && (
              <div>
                {"⭐️ דירוג: "}
                <span>{rating}</span>
                {ratingSearchType === RATING_SEARCH_TYPE_ONLY
                  ? " (רק)"
                  : " (ומעלה)"}
              </div>
            )}
            {category !== "" && (
              <div>
                {"☝️ קטגוריה: "} <span>{category}</span>
              </div>
            )}
            <div className="clear-search-button" onClick={clearAllFilters}>
              נקה חיפוש
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
