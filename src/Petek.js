const NO_OWNER_PIC_PLACEHOLDER = 'https://erasmuscoursescroatia.com/wp-content/uploads/2015/11/no-user.jpg';

export default ({petek, editPetek, deletePetek, ownerPic, ownerPics, enableScaleDown, isHidden}) => {
    const dateAsString = (new Date(petek.createdAt)).toLocaleDateString();

    const handleClick = () => {
        if (editPetek == null) {
            return;
        }

        editPetek(petek);
    }

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        deletePetek(petek.id);
    }

    return (
        <div className={`petek-container ${isHidden ? 'hidden' : ''}`} onClick={handleClick} style={enableScaleDown ? {transform: `scale(0.8)`} : {}}>
            {deletePetek && <div className="delete-button" onClick={handleDeleteClick}>X</div>}
            <div className="petek-owner">
                <div className="picture">
                    {petek.owner === 'אליאור' ? <div className="crown">👑</div> : null}
                    <img src={ownerPic || NO_OWNER_PIC_PLACEHOLDER} />
                </div>
                {petek.owner}
            </div>
            <div className="petek-text" direction="auto">
                {petek.situation && <div className="petek-situation">{`${petek.situation}`}</div>}
                {petek.content.split('\n').map(line => {
                    // let lineWithBoldSupport = '';
                    // line.split('*').map
                    // Support for lines and bold
                    return <div dir="auto">{line.split('*').map((part, index) => {
                        if (index % 2 === 0) {
                            return <span key={index}>{part}</span>;
                        } else {
                            return <b key={index}>{part}</b>;
                        }
                    })}</div>;
                })}
            </div>
            {
                petek.allRelated && (
                    <div className="related-tags-container">
                        {Object.keys(petek.allRelated).map(relatedKey => {
                            const relatedPic = ownerPics && ownerPics[relatedKey];
                            return <div key={relatedKey} className="related-tag"><img src={relatedPic || NO_OWNER_PIC_PLACEHOLDER} /> {relatedKey}</div>
                        })}
                    </div>
                )
            }
            {
                petek.category && (
                    <div className="categories-tags-container">
                        <div className="category-tag">{petek.category}</div>
                    </div>
                )
            }
            <div className="petek-footer">
                {petek.rating != null && petek.rating !== 0 &&
                    <div className="rating-container">
                        <span>{petek.rating}</span>
                        <div className="star"></div>
                    </div>
                }
                <div className="petek-time">התווסף ב: {dateAsString}</div>
            </div>
        </div>
    );
}
