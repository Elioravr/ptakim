import {useEffect, useState, useMemo} from 'react';

import Separator from './Separator';
import CountUp from 'react-countup';
import { PieChart } from 'react-minimal-pie-chart';

export default ({page, setPage, list}) => {
    const [statistics, setStatistics] = useState({});
    const [ratingPerPerson, setRatingPerPerson] = useState({});
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

        let calculatedRatingPerPerson = Object.keys(list).reduce((result, currentPetekKey) => {
            const currentPetek = list[currentPetekKey];
            // console.log('result', result);
            // console.log('currentPetek.owner', currentPetek.owner);
            // console.log('result[currentPetek.owner]', result[currentPetek.owner]);

            if (result[currentPetek.owner] == null) {
                console.log('1');
                result[currentPetek.owner] = {
                    count: 1,
                    sum: currentPetek.rating
                };

                console.log('result', result);
            } else {
                console.log('2');
                result[currentPetek.owner].count++;
                result[currentPetek.owner].sum += currentPetek.rating;
            }

            return result;
        }, {});

        Object.keys(calculatedRatingPerPerson).forEach(currentPetekKey => {
            const {sum, count} = calculatedRatingPerPerson[currentPetekKey];
            calculatedRatingPerPerson[currentPetekKey].average = (sum / count).toFixed(1);
        });

        console.log('calculatedRatingPerPerson', calculatedRatingPerPerson);
        setRatingPerPerson(calculatedRatingPerPerson);
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

    const handleClose = () => {
        setPage('app');
    };

    console.log('ratingPerPerson', ratingPerPerson);

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

                    <Stats stats={statistics} sortedList={sortedList} maxCount={maxCount} ratingPerPerson={ratingPerPerson} />

                    <Separator emoji="⭐️" />

                    <div className="section-container">
                        <div className="title">התפלגות לפי ציונים</div>
                        <Stats stats={ratingStats} sortedList={ratingSortedList} maxCount={ratingMaxCount} namePrefix="⭐️" />
                    </div>

                    <Separator emoji="📊" />

                    <div className="section-container">
                        <div className="title">התפלגות לפי ציונים</div>
                        <PieChart
                            animate={true}
                            animationDuration={500}
                            labelPosition={100 - 60 / 2}
                            style={{
                                fontFamily: '"Roboto Sans", -apple-system, Helvetica, Arial, sans-serif',
                                fontSize: '8px',
                                color: 'white'
                            }}
                            label={({ dataEntry }) => dataEntry.title}
                            data={Object.keys(ratingStats).map((ratingLabel, index) => {
                                let color = '';
                                if (index % 3 === 0) {
                                    color = '007bff'
                                } else if (index % 3 === 1) {
                                    color = 'FF530F'
                                } else {
                                    color = '005abb'
                                }

                                return {title: `⭐️ ${ratingLabel}`, value: ratingStats[ratingLabel], color: `#${color}`};
                            })}
                        />
                    </div>

                    <Separator emoji="🤩" />
                </div>
            }
        </div>
    );
}

const Stats = ({sortedList, stats, maxCount, namePrefix, ratingPerPerson}) => {
    console.log('ratingPerPerson', ratingPerPerson);

    console.log('sortedList', sortedList);
    return sortedList.map((item, index) => {
        console.log('item', item);
        const count = stats[item];
        // console.log('namePrefix', namePrefix);

        return (
            <div className="statistic-container" key={index}>
                <div className="metadata-container">
                    <div className="name-and-rating-container">
                        <div className="owner-name">{`${namePrefix ? `${namePrefix} ` : ''}${item}`}</div>
                        {ratingPerPerson && <div className="average-rating">{`(${ratingPerPerson[item].average} ⭐️)`}</div>}
                    </div>
                    <CountUp end={count} duration={2} />
                </div>
                <div className="count-graph" style={{width: `${(count / maxCount) * 100}%`}}></div>
            </div>
        );
    });
}
