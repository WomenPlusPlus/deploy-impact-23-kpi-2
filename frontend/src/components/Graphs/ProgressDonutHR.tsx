import EChartsReact from 'echarts-for-react';
import { GraphTooltipParam } from '../../types';

const ProgressDonutHR = () => {
  const value = 81.66666666666667; // This is the value you want to display

  const option = {
    title: [
      {
        text: 'Average Progress (%)',
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
        radius: ['50%', '80%'],
        data: [
          {
            value: value,
            name: 'Progress',
            itemStyle: { color: '#E5A200' },
          },
          // This data entry will represent the unfilled portion of the donut
          {
            value: 100 - value,
            name: 'Remaining',
            itemStyle: { color: '#F0EEEB' },
          },
        ],
        label: {
          show: true,
          position: 'center',
          formatter: function (params: GraphTooltipParam) {
            return params.value.toFixed(1) + '%'; // Updated to round the values displayed in the center
          },
          fontSize: 30,
          fontWeight: 'bolder',
          fontFamily: 'Montserrat',
          color: 'inherit',
        },
      },
    ],
  };
  return (
    <EChartsReact
      option={option}
      style={{ height: '200px' }}
    />
  );
};

export default ProgressDonutHR;
