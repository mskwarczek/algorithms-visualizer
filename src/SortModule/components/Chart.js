import React from 'react';

const Chart = ({
  data,
  dataParams,
  displayParams,
  dataBackground,
}) => {

  return (
    <div className='sortContainer__chart'>
      {data.length > 0 && data.map((elem, index) =>
        <div
          key={index}
          style={{
            height: (elem - dataParams.min) / (dataParams.max - dataParams.min) * 100 + '%',
            width: (displayParams.chartMarigins === true ? 80 : 100) / dataParams.size + '%',
            marginLeft: displayParams.dataMarigins === 'true' ? '1px' : '0',
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
