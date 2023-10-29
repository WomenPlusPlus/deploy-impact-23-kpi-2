import EChartsReact from 'echarts-for-react';
import { GraphTooltipParam } from '../../types';

const ProgressCircularHR = () => {
  const option = {
    title: [
      {
        text: 'Cumulated Progress (%)',
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
        { value: 75.0001, itemStyle: { color: '#e5a200' } },
        { value: 95.0001, itemStyle: { color: '#FBBB21' } },
        { value: 75.0001, itemStyle: { color: '#FECC33' } },
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
        'involuntary headcount change (FTE)',
        'share of teams constituted as circles',
        'share short term leave',
      ], // introduce kpi names for circle
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
      style={{ height: '200px' }}
    />
  );
};

export default ProgressCircularHR;
