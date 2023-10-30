import EChartsReact from 'echarts-for-react';

const PerformanceLineAllCircles = () => {
  const option = {
    title: {
      text: 'Historical Performance (%) Per Circle Over Time', // Add this line to set the title
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
      name: 'Performance',
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
        type: 'line',
        smooth: 'True',
        itemStyle: { color: '#5B6A00' },
        label: { show: false },
        emphasis: { focus: 'series' },
        data: [3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 6.0, 6.0, 6.0],
      },
      {
        name: 'Fundraising',
        type: 'line',
        smooth: 'True',
        itemStyle: { color: '#1C6420' },
        label: { show: false },
        emphasis: { focus: 'series' },
        data: [
          1.0, 4.0, 6.0, 7.0, 9.0, 11.0, 13.0, 14.0, 16.0, 17.0, 19.0, 20.0,
        ],
      },
      {
        name: 'Hr',
        type: 'line',
        smooth: 'True',
        itemStyle: { color: '#08C2DB' },
        label: { show: false },
        emphasis: { focus: 'series' },
        data: [
          44.33, 64.0, 47.33, 61.0, 69.33, 64.0, 50.0, 58.33, 58.33, 58.33,
          61.0, 61.0,
        ],
      },
      {
        name: 'Program',
        type: 'line',
        smooth: 'True',
        itemStyle: { color: '#072490' },
        label: { show: false },
        emphasis: { focus: 'series' },
        data: [
          -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0,
        ],
      },
      {
        name: 'Programs - Children - Counceling',
        type: 'line',
        smooth: 'True',
        itemStyle: { color: '#D63503' },
        label: { show: false },
        emphasis: { focus: 'series' },
        data: [
          80.0, 80.0, 80.0, 60.0, 60.0, 60.0, 40.0, 40.0, 40.0, 60.0, 60.0,
          60.0,
        ],
      },
      {
        name: 'Programs - Parents -Online',
        type: 'line',
        smooth: 'True',
        itemStyle: { color: '#8C5009' },
        label: { show: false },
        emphasis: { focus: 'series' },
        data: [
          8.33, 9.33, 10.0, 11.0, 11.67, 12.67, 13.33, 14.0, 15.0, 16.0, 16.67,
          17.67,
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

export default PerformanceLineAllCircles;
