import EChartsReact from 'echarts-for-react';
import { GraphTooltipParam } from '../../types';

const ProgressRadialHR = () => {
  const option = {
    textStyle: {
      fontFamily: 'Montserrat',
    },
    title: [
      {
        text: 'Collective Progress (%)',
        left: '0%', // Adjusted: Align the title to the left
        top: 'top',
        textStyle: {
          color: '#000',
          fontFamily: 'Montserrat', // Adjusted: Set the font to Montserrat
          fontSize: 12, // Adjusted: Set the font size
        },
      },
    ],
    legend: {
      show: true,
      top: 25, // Adjust this value based on the actual height of your title
      type: 'scroll',
      padding: [5, 10],
      orient: 'horizontal', // Change the orientation to horizontal
      left: 'center', // Center the legend
      textStyle: {
        fontSize: 10, // Adjusted the legend font size here
      },
    },
    tooltip: {
      trigger: 'item',
      textStyle: {
        fontFamily: 'Montserrat',
      },
      formatter: function (params: GraphTooltipParam) {
        return (
          params.name + '<br>' + params.marker + ' ' + Math.round(params.value)
        );
      },
    },
    toolbox: {
      show: false,
      feature: {
        mark: { show: false },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: 'KPIs Progress',
        type: 'pie',
        radius: [20, 80],
        center: ['50%', '60%'],
        roseType: 'area',
        label: {
          position: 'outside', // Place labels outside the pie chart
          formatter: '{b}: {d}%', // Display the name and percentage
          color: '#000', // Set label text color
          fontSize: 0, //hide for now
        },
        labelLine: {
          show: false, // Display the label line
          length: 15, // Length of the line from the pie to the label
          length2: 10, // Length from the end of the first line to the label
        },
        itemStyle: {
          borderRadius: 0,
        },
        data: [
          {
            value: 101.0001,
            name: 'additional monetization/savings from CRM',
            itemStyle: { color: '#5B6A00' },
          },
          {
            value: 107.0001,
            name: 'private donations',
            itemStyle: { color: '#1C6420' },
          },
          {
            value: 75.0001,
            name: 'involuntary headcount change (FTE)',
            itemStyle: { color: '#08C2DB' },
          },
          {
            value: 95.0001,
            name: 'share of teams constituted as circles',
            itemStyle: { color: '#93E8F4' },
          },
          {
            value: 75.0001,
            name: 'share short term leave',
            itemStyle: { color: '#C5F7FD' },
          },
          {
            value: 103.0001,
            name: 'additional monetization/savings from programs',
            itemStyle: { color: '#072490' },
          },
          {
            value: 45.0001,
            name: 'reachability',
            itemStyle: { color: '#D63503' },
          },
          {
            value: 125.0001,
            name: 'count leads',
            itemStyle: { color: '#8C5009' },
          },
          {
            value: 124.0001,
            name: 'count sessions on .projuventute.ch',
            itemStyle: { color: '#F59019' },
          },
          {
            value: 68.0001,
            name: 'net promoter score',
            itemStyle: { color: '#FFCB8D' },
          },
        ],
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

export default ProgressRadialHR;
