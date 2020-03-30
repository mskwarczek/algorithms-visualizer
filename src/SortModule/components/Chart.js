import React from 'react';

const Chart = ({
  data,
  dataParams,
  displayParams,
  dataBackground,
}) => {

  return (
    <div
      className='sortContainer__chart'
      style={{
        padding: `0 ${displayParams.chartMargins === true ? 10 : 1}%`,
      }}
    >
      {data.length > 0 && data.map((elem, index) =>
        <div
          key={index}
          style={{
            height: (elem - dataParams.min) / (dataParams.max - dataParams.min) * 100 + '%',
            width: 100 / dataParams.size + '%',
            marginLeft: displayParams.dataMargins === 'true' ? '1px' : '0',
            textAlign: 'center',
            [dataBackground.type]: dataBackground.values[index],
          }}
        >
          {displayParams.dataLabels === 'true' && <p className='sortContainer__label'>{elem}</p>}
        </div>
      )}
    </div>
  );
};

export default Chart;
