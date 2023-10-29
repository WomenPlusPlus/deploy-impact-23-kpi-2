import EChartsReact from 'echarts-for-react';

const ProgressBarAllCircles = () => {
  const option = {
    title: {
      text: 'Stacked Progress (%) Of All Circles Over Time', // Add this line to set the title
      left: '0%', // Optional: Align the title
      top: 'top', // Optional: Set the position of the title
      textStyle: {
        // Optional: Style the title
        color: '#000',
        fontFamily: 'Montserrat',
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
      },
      textStyle: {
        fontFamily: 'Montserrat',
      },
    },
    legend: {
      type: 'scroll',
      top: 20, //use this to move legend below title
      itemGap: 50, // space between legend items
      textStyle: {
        // Added textStyle attribute here to set the font for legend text
        fontFamily: 'Montserrat',
        fontSize: 10,
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '30%', // Increased the space between the grid and the title
      containLabel: true,
    },
    xAxis: {
      type: 'category',
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
      ],
      axisLabel: {
        // Added axisLabel attribute here to set the font for axis labels
        fontFamily: 'Montserrat',
      },
    },
    yAxis: {
      type: 'value',
      name: 'Progress',
      nameLocation: 'center',
      nameGap: 50,
      nameTextStyle: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'Montserrat', // Added fontFamily here
      },
      axisLabel: {
        // Added axisLabel attribute here to set the font for axis labels
        fontFamily: 'Montserrat',
      },
    },
    series: [
      {
        name: 'Digital',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#5B6A00' },
        label: { show: false },
        emphasis: { focus: 'series' },
        data: [
          74.0, 74.0, 74.0, 74.0, 74.0, 74.0, 74.0, 74.0, 74.0, 101.0, 101.0,
          101.0,
        ],
      },
      {
        name: 'Fundraising',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#1C6420' },
        label: { show: false },
        emphasis: { focus: 'series' },
        data: [
          0.0, 14.0, 26.0, 34.0, 46.0, 55.0, 64.0, 71.0, 81.0, 88.0, 98.0,
          107.0,
        ],
      },
      {
        name: 'Hr',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#08C2DB' },
        label: { show: false },
        emphasis: { focus: 'series' },
        data: [
          53.33, 50.0, 58.33, 51.67, 56.67, 68.33, 78.33, 80.0, 80.0, 80.0,
          81.67, 81.67,
        ],
      },
      {
        name: 'Program',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#072490' },
        label: { show: false },
        emphasis: { focus: 'series' },
        data: [
          60.0, 60.0, 60.0, 60.0, 60.0, 60.0, 71.0, 71.0, 71.0, 103.0, 103.0,
          103.0,
        ],
      },
      {
        name: 'Programs - Children - Counceling',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#D63503' },
        label: { show: false },
        emphasis: { focus: 'series' },
        data: [
          46.0, 46.0, 46.0, 45.0, 45.0, 45.0, 44.0, 44.0, 44.0, 45.0, 45.0,
          45.0,
        ],
      },
      {
        name: 'Programs - Parents -Online',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#8C5009' },
        label: { show: false },
        emphasis: { focus: 'series' },
        data: [
          13.0, 21.0, 29.67, 38.33, 46.67, 55.33, 63.33, 71.0, 79.33, 88.0,
          97.0, 105.67,
        ],
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

export default ProgressBarAllCircles;
