// @flow

import React, {useEffect, useState} from 'react';

import Separator from './Separator';
import CountUp from 'react-countup';
import {PieChart} from 'react-minimal-pie-chart';
import type {
  PageType,
  PetekListType,
  RatingPerPersonType,
  StatisticsType,
} from './AppTypes.flow';
import type {MixedElement} from 'react';

type Props = $ReadOnly<{
  page: PageType,
  setPage: (PageType) => void,
  list: PetekListType,
  onOwnerClick: (string) => void,
}>;

export default function StatisticsPage({
  page,
  setPage,
  list,
  onOwnerClick,
}: Props): MixedElement {
  const [statistics, setStatistics] = useState<StatisticsType>({});
  const [ratingPerPerson, setRatingPerPerson] = useState<RatingPerPersonType>(
    {},
  );
  const [ratingStats, setRatingStats] = useState<$ReadOnly<{[number]: number}>>(
    {},
  );
  const className = `page modal statistics-page ${
    page === 'statistics' ? 'visible' : ''
  }`;

  useEffect(() => {
    const calculatedStatistics = Object.keys(list).reduce(
      (result, currentPetekKey) => {
        const currentPetek = list[currentPetekKey];

        if (!result[currentPetek.owner]) {
          result[currentPetek.owner] = 1;
        } else {
          result[currentPetek.owner] = result[currentPetek.owner] + 1;
        }

        return result;
      },
      {},
    );

    setStatistics(calculatedStatistics);

    const calculatedRatingStats = Object.keys(list).reduce(
      (result, currentPetekKey) => {
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
      },
      {},
    );

    setRatingStats(calculatedRatingStats);

    let calculatedRatingPerPerson = Object.keys(list).reduce(
      (result, currentPetekKey) => {
        const currentPetek = list[currentPetekKey];

        if (result[currentPetek.owner] == null) {
          result[currentPetek.owner] = {
            count: 1,
            sum: currentPetek.rating,
          };
        } else {
          result[currentPetek.owner].count++;
          result[currentPetek.owner].sum += currentPetek.rating;
        }

        return result;
      },
      {},
    );

    Object.keys(calculatedRatingPerPerson).forEach((currentPetekKey) => {
      const {sum, count} = calculatedRatingPerPerson[currentPetekKey];
      calculatedRatingPerPerson[currentPetekKey].average = (
        sum / count
      ).toFixed(1);
    });

    setRatingPerPerson(calculatedRatingPerPerson);
  }, [list]);

  const sortedList = Object.keys(statistics).sort((a, b) => {
    return statistics[b] - statistics[a];
  });
  const maxCount = statistics[sortedList[0]];

  let ratingSortedList = Object.keys(ratingStats).sort((a, b) => {
    return ratingStats[parseInt(b, 10)] - ratingStats[parseInt(a, 10)];
  });
  const ratingMaxCount = ratingStats[parseInt(ratingSortedList[0], 10)];
  // ratingSortedList = ratingSortedList.slice(1, ratingSortedList.length);

  const handleClose = () => {
    setPage('app');
  };

  return (
    <div className={className}>
      <div className="page-header">
        <span>סטטיסטיקות</span>
        <div onClick={handleClose}>x</div>
      </div>

      {page === 'statistics' && (
        <div className="modal-body">
          <div className="section-container">
            <div className="title">
              <span>{`עד היום יש בסך הכל `}</span>
              <CountUp end={Object.keys(list).length} />
              <span>{` פתקים`}</span>
            </div>
          </div>

          <Separator emoji="😱" />

          <Stats
            stats={statistics}
            sortedList={sortedList}
            maxCount={maxCount}
            ratingPerPerson={ratingPerPerson}
            onOwnerClick={onOwnerClick}
          />

          <Separator emoji="⭐️" />

          <div className="section-container">
            <div className="title">התפלגות לפי ציונים</div>
            <Stats
              stats={ratingStats}
              sortedList={ratingSortedList}
              maxCount={ratingMaxCount}
              namePrefix="⭐️"
            />
          </div>

          <Separator emoji="📊" />

          <div className="section-container">
            <div className="title">התפלגות לפי ציונים</div>
            <PieChart
              animate={true}
              animationDuration={500}
              labelPosition={100 - 60 / 2}
              style={{
                fontFamily:
                  '"Roboto Sans", -apple-system, Helvetica, Arial, sans-serif',
                fontSize: '8px',
                color: 'white',
              }}
              label={({dataEntry}) => dataEntry.title}
              data={Object.keys(ratingStats).map((ratingLabel, index) => {
                let color = '';
                if (index % 3 === 0) {
                  color = '007bff';
                } else if (index % 3 === 1) {
                  color = 'FF530F';
                } else {
                  color = '005abb';
                }

                const ratingLabelAsNumber = parseInt(ratingLabel, 10);

                return {
                  title: `⭐️ ${ratingLabel}`,
                  value: ratingStats[ratingLabelAsNumber],
                  color: `#${color}`,
                  key: index,
                };
              })}
            />
          </div>

          <Separator emoji="🤩" />
        </div>
      )}
    </div>
  );
}

const Stats = ({
  sortedList,
  stats,
  maxCount,
  namePrefix,
  ratingPerPerson,
  onOwnerClick,
}: $ReadOnly<{
  sortedList: $ReadOnlyArray<string>,
  stats: StatisticsType,
  maxCount: number,
  namePrefix?: string,
  ratingPerPerson?: RatingPerPersonType,
  onOwnerClick?: (string) => void,
}>) => {
  const handleOwnerClick = (item) => {
    if (onOwnerClick != null) {
      onOwnerClick(item);
    }
  };

  return sortedList.map((item, index) => {
    const count = stats[item];

    return (
      <div
        className="statistic-container"
        key={index}
        onClick={() => handleOwnerClick(item)}>
        <div className="metadata-container">
          <div className="name-and-rating-container">
            <div className="owner-name">{`${
              namePrefix ? `${namePrefix} ` : ''
            }${item}`}</div>
            {ratingPerPerson && (
              <div className="average-rating">{`(${ratingPerPerson[item].average} ⭐️)`}</div>
            )}
          </div>
          <CountUp end={count} duration={2} />
        </div>
        <div
          className="count-graph"
          style={{width: `${(count / maxCount) * 100}%`}}></div>
      </div>
    );
  });
};
