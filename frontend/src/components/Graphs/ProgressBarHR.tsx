import EChartsReact from 'echarts-for-react';

const ProgressBarHR = () => {
  const option = {
    title: {
      text: 'Progress (%) per Month per KPI', // Add this line to set the title
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
      top: 30, //use this to move legend below title
      itemGap: 30, // space between legend items
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
        fontSize: 8,
        fontFamily: 'Montserrat', // Added fontFamily here
      },
      axisLabel: {
        // Added axisLabel attribute here to set the font for axis labels
        fontFamily: 'Montserrat',
      },
    },
    series: [
      {
        name: 'Involuntary Headcount Change (Fte)',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#e5a200' },
        label: { show: true },
        emphasis: { focus: 'series' },
        data: [
          50.0, 50.0, 75.0, 75.0, 75.0, 75.0, 100.0, 75.0, 75.0, 75.0, 75.0,
          75.0,
        ],
      },
      {
        name: 'Share Of Teams Constituted As Circles',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#FBBB21' },
        label: { show: true },
        emphasis: { focus: 'series' },
        data: [
          35.0, 50.0, 50.0, 55.0, 70.0, 80.0, 85.0, 90.0, 90.0, 90.0, 95.0,
          95.0,
        ],
      },
      {
        name: 'Share Short Term Leave',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#FECC33' },
        label: { show: true },
        emphasis: { focus: 'series' },
        data: [
          75.0, 50.0, 50.0, 25.0, 25.0, 50.0, 50.0, 75.0, 75.0, 75.0, 75.0,
          75.0,
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

export default ProgressBarHR;
