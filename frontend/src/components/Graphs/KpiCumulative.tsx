import EChartsReact from 'echarts-for-react';
import { GraphTooltipParam } from '../../types';

const KpiCumulative = () => {
  const data = [
    {
      name: 'Involuntary Headcount Change (Fte)',
      type: 'line',
      data: [2.0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      itemStyle: { color: '#4E17B0' },
      markLine: {
        silent: true,
        data: [
          {
            yAxis: 1.0833333333333333,
            lineStyle: { color: '#D00071', width: 1.5, type: 'dotted' },
            label: {
              show: true,
              position: 'end',
              formatter: 'Mean',
              color: '#000000',
            },
          },
          {
            yAxis: 0.0,
            lineStyle: { color: '#D00071', width: 1.5, type: 'dotted' },
            label: {
              show: true,
              position: 'end',
              formatter: 'Target',
              color: '#000000',
            },
          },
          {
            yAxis: 4.0,
            lineStyle: { color: '#D00071', width: 1.5, type: 'dotted' },
            label: {
              show: true,
              position: 'end',
              formatter: 'Baseline',
              color: '#000000',
            },
          },
        ],
        symbol: 'none',
      },
    },
  ];

  // Configure chart options
  const option = {
    title: {
      text: 'Involuntary Headcount Change (Fte)',
      textStyle: {
        fontFamily: 'Montserrat',
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params: GraphTooltipParam[]) {
        return (
          params[0].axisValueLabel +
          '<br/>' +
          params
            .map(function (item) {
              return item.marker + ' ' + item.seriesName + ': ' + item.data;
            })
            .join('<br/>')
        );
      },
      textStyle: {
        fontFamily: 'Montserrat',
        fontSize: 12,
      },
    },
    legend: {
      data: ['involuntary headcount change (FTE)'], //KPIs
      bottom: 0,
      textStyle: {
        fontFamily: 'Montserrat',
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ], //MONTHS
      axisLabel: {
        textStyle: {
          fontFamily: 'Montserrat',
        },
      },
    },
    yAxis: {
      type: 'value',
      scale: true,
      name: '%', // Add this line to label the y-axis
      max: 4.0,
      min: 0.0,
      //nameLocation: 'center',
      //nameGap: 50,
      nameTextStyle: {
        // Optional: Style the y-axis label
        color: '#000',
        fontFamily: 'Montserrat',
        fontSize: 14,
      },
      axisLabel: {
        textStyle: {
          fontFamily: 'Montserrat',
        },
      },
    },
    series: data,
  };
  return (
    <EChartsReact
      option={option}
      style={{ height: '210px' }}
    />
  );
};

export default KpiCumulative;
