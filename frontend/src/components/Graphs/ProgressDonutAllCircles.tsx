import EChartsReact from 'echarts-for-react';
import { GraphTooltipParam } from '../../types';

const ProgressDonutAllCircles = () => {
  const value = 91.0; // This is the value you want to display

  const option = {
    title: [
      {
        text: 'Average Progress (%) For Projuventute, All Circles Included',
        left: '0%',
        top: 'top',
        textStyle: {
          color: '#000',
          fontFamily: 'Montserrat',
          fontSize: 12,
        },
      },
    ],
    tooltip: {
      trigger: 'item',
      textStyle: {
        fontFamily: 'Montserrat',
      },
      formatter: function (params: GraphTooltipParam) {
        return params.name + ': ' + params.value.toFixed(1) + '%';
      },
    },
    series: [
      {
        name: 'Progress',
        type: 'pie',
        radius: ['50%', '70%'],
        data: [
          { value: 91.0, name: 'Progress', itemStyle: { color: '#E5A200' } },
          // This data entry will represent the unfilled portion of the donut
          { value: 9.0, name: 'Remaining', itemStyle: { color: '#F0EEEB' } },
        ],
        label: {
          show: true,
          position: 'center',
          formatter: function () {
            return value.toFixed(1) + '%'; // Updated to round the values displayed in the center
          },
          fontSize: 30,
          fontWeight: 'bolder',
          fontFamily: 'Montserrat',
          color: '#FBBB21',
        },
      },
    ],
  };
  return (
    <EChartsReact
      option={option}
      style={{ height: '210px' }}
    />
  );
};

export default ProgressDonutAllCircles;
