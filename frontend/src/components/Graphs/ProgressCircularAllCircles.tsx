import EChartsReact from 'echarts-for-react';
import { GraphTooltipParam } from '../../types';

const ProgressCircularAllCircles = () => {
  const option = {
    title: [
      {
        text: 'Average Progress (%) Per Circle Up Until Today', // Add this line to set the title
        left: '0%', // Optional: Align the title
        top: 'top', // Optional: Set the position of the title
        textStyle: {
          color: '#000',
          fontFamily: 'Montserrat',
          fontSize: 12,
        },
      },
    ],
    series: {
      name: 'Progress',
      type: 'bar',
      data: [
        { value: 101.0001, itemStyle: { color: '#5B6A00' } },
        { value: 107.0001, itemStyle: { color: '#1C6420' } },
        { value: 81.66676666666667, itemStyle: { color: '#08C2DB' } },
        { value: 103.0001, itemStyle: { color: '#072490' } },
        { value: 45.0001, itemStyle: { color: '#D63503' } },
        { value: 105.66676666666667, itemStyle: { color: '#8C5009' } },
      ],
      coordinateSystem: 'polar',
      label: {
        show: false,
        position: 'middle',
        formatter: '{b}: {c}',
        textStyle: {
          fontFamily: 'Montserrat',
        },
      },
    },
    tooltip: {
      // formated here to show round values at display
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      textStyle: {
        fontFamily: 'Montserrat',
      },
      formatter: function (params: GraphTooltipParam[]) {
        var tip = params[0].axisValueLabel + '<br>';
        params.forEach(function (param) {
          tip +=
            param.marker +
            ' ' +
            param.seriesName +
            ': ' +
            Math.round(param.value) +
            '<br>';
        });
        return tip;
      },
    },
    polar: {
      radius: [30, '80%'],
    },
    angleAxis: {
      max: 100,
      startAngle: 90,
      axisLabel: {
        textStyle: {
          fontFamily: 'Montserrat',
        },
      },
    },
    radiusAxis: {
      type: 'category',
      data: [
        'Digital',
        'Fundraising',
        'HR',
        'Program',
        'Programs - Children - Counceling',
        'Programs - Parents -Online',
      ], // introduce names for circles
      show: false, // hide labels in front of bars, too messy
      axisLabel: {
        textStyle: {
          fontFamily: 'Montserrat',
        },
      },
    },
  };
  return (
    <EChartsReact
      option={option}
      style={{ height: '210px' }}
    />
  );
};

export default ProgressCircularAllCircles;
