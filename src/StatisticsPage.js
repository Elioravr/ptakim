import {useEffect, useState, useMemo} from 'react';

import Separator from './Separator';
import CountUp from 'react-countup';

export default ({page, setPage, list}) => {
    const [statistics, setStatistics] = useState({});
    const [ratingStats, setRatingStats] = useState({});
    const className = `page modal statistics-page ${page === 'statistics' ? 'visible' : ''}`;

    useEffect(() => {
        const calculatedStatistics = Object.keys(list).reduce((result, currentPetekKey) => {
            const currentPetek = list[currentPetekKey];

            if (!result[currentPetek.owner]) {
                result[currentPetek.owner] = 1;
            } else {
                result[currentPetek.owner] = result[currentPetek.owner] + 1;
            }

            return result;
        }, {});

        setStatistics(calculatedStatistics);

        const calculatedRatingStats = Object.keys(list).reduce((result, currentPetekKey) => {
            const currentPetek = list[currentPetekKey];

            if (currentPetek.rating == null || currentPetek.rating === 0) {
                return result;
            }

            if (result[currentPetek.rating] == null) {
                result[currentPetek.rating] = 1;
            } else {
                result[currentPetek.rating] = result[currentPetek.rating] + 1;
            }

            return result;
        }, {});

        setRatingStats(calculatedRatingStats);
    }, [list]);


    const sortedList = Object.keys(statistics).sort((a, b) => {
        return statistics[b] - statistics[a];
    });
    const maxCount = statistics[sortedList[0]];

    let ratingSortedList =
        Object.keys(ratingStats)
            .sort((a, b) => {
                return ratingStats[b] - ratingStats[a];
            });
    const ratingMaxCount = ratingStats[ratingSortedList[0]];
    // ratingSortedList = ratingSortedList.slice(1, ratingSortedList.length);

    // console.log('ratingSortedList', ratingSortedList);

    const handleClose = () => {
        setPage('app');
    };

    return (
        <div className={className}>
            <div className="page-header">
                <span>סטטיסטיקות</span>
                <div onClick={handleClose}>x</div>
            </div>

            {page === 'statistics' &&
                <div className="modal-body">
                    <div className="section-container">
                        <div className="title">
                            <span>{`עד היום יש בסך הכל `}</span>
                            <CountUp end={Object.keys(list).length} />
                            <span>{` פתקים`}</span>
                        </div>
                    </div>

                    <Separator emoji="😱" />

                    <Stats stats={statistics} sortedList={sortedList} maxCount={maxCount} />

                    <Separator emoji="⭐️" />

                    <div className="section-container">
                        <div className="title">התפלגות לפי ציונים</div>
                        <Stats stats={ratingStats} sortedList={ratingSortedList} maxCount={ratingMaxCount} namePrefix="⭐️" />
                    </div>

                </div>
            }
        </div>
    );
}

const Stats = ({sortedList, stats, maxCount, namePrefix}) => {
    return sortedList.map((item, index) => {
        // console.log('sortedList', sortedList);
        // console.log('sortedList[item]', sortedList[item]);
        const count = stats[item];

        return (
            <div className="statistic-container" key={index}>
                <div className="metadata-container">
                    <div className="owner-name">{`${namePrefix ? `${namePrefix} ` : ''}${item}`}</div>
                    <CountUp end={count} duration={2} />
                </div>
                <div className="count-graph" style={{width: `${(count / maxCount) * 100}%`}}></div>
            </div>
        );
    });
}
