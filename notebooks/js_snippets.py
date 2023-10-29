
# ===========================================================================  
# these functions are the three functions to produc the JS code for the plots
# each function serves for a differennt kind of screen
    # dataViz: for actual data plots per kpi in current circle
    # progressViz: for progress metrics plots per circle
    # performanceViz: for progress & performance metrics plots for Projuventute
# =========================================================================== 

def dataViz(inputDict):
    """
    Produce JS code to plot the data
    Args:   inputDict (dict) contianing graphID and graphValues keys, containing each a dictionary
            both dictionaries will feed the required values to generate the code
    Returns: JS code (str)
    """
    kpi = inputDict['graphID']['kpi']
    periodicity = inputDict['graphID']['periodicity']
    unit = inputDict['graphID']['unit']
    
    def extractInitials(phrase):
        """
        Convert a phrase to initials in capital letters.
        Function used for the Gauge/Score plots.
        Args: phrase (str)
        Returns: initials (str)
        """
        words = phrase.split()
        result = ""
        for word in words:
            result += word[0].upper()
        return result
            
    if periodicity == 'month':
        
        if  unit == 'chf'or unit == 'amount':
            
            varData = """
            // Initialize the echarts instance based on the prepared dom
            var myChart = echarts.init(document.getElementById('main'));

            // Apply Montserrat font to ECharts container
            document.getElementById('main').style.fontFamily ='Montserrat, sans-serif';

            // Prepare data
            var data = [
                {
                name: '"""+kpi+"""',
                type: 'line',
                data: """+str(inputDict['graphValues']['values'])+""",
                itemStyle: {color: '"""+inputDict['graphValues']['palette0']+"""'},
                markLine: {
                    silent: true,
                    data: [
                        {
                            yAxis: """+str(inputDict['graphValues']['target'])+""",
                            lineStyle: {color: '#D00071', width: 1.5, type: 'dotted'},
                            label: {
                                show: true,
                                position: 'end',
                                formatter: 'Target',
                                color: '#000000'
                            }
                        },
                        {
                            yAxis: """+str(inputDict['graphValues']['baseline'])+""",
                            lineStyle: {color: '#D00071', width: 1.5, type: 'dotted'},
                            label: {
                                show: true,
                                position: 'end',
                                formatter: 'Baseline',
                                color: '#000000'
                            }
                        }
                    ],
                    symbol: 'none'
                }
            },
            {
            name: 'Cumulative',
                type: 'line',
                data: """+str(inputDict['graphValues']['valuesCum'])+""", // Add cumulative data here
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(208, 0, 113, 0.5)' // color at 0% position
                            }, {
                                offset: 1, color: 'rgba(208, 0, 113, 0)' // color at 100% position
                            }],
                            global: false // false by default
                        }
                    },  
                itemStyle: {color: '"""+inputDict['graphValues']['palette1']+"""'}  
            }
            ];
            """
        
        elif  unit == '%_cumulative':
            
            varData = """
            // Initialize the echarts instance based on the prepared dom
            var myChart = echarts.init(document.getElementById('main'));

            // Apply Montserrat font to ECharts container
            document.getElementById('main').style.fontFamily ='Montserrat, sans-serif';
            
            // Prepare data
            var data = [
                {
                name: 'Cumulative """+kpi.title()+"""',
                    type: 'line',
                    data: """+str(inputDict['graphValues']['values'])+""", // Add cumulative data here
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(208, 0, 113, 0.5)' // color at 0% position
                                }, {
                                    offset: 1, color: 'rgba(208, 0, 113, 0)' // color at 100% position
                                }],
                                global: false // false by default
                            }
                        },  
                    itemStyle: {color: '"""+inputDict['graphValues']['palette1']+"""'},
                    markLine: {
                        silent: true,
                        data: [
                            {
                                yAxis: """+str(inputDict['graphValues']['target'])+""",
                                lineStyle: {color: '#D00071', width: 1.5, type: 'dotted'},
                                label: {
                                    show: true,
                                    position: 'end',
                                    formatter: 'Target',
                                    color: '#000000'
                                }
                            },
                            {
                                yAxis: """+str(inputDict['graphValues']['baseline'])+""",
                                lineStyle: {color: '#D00071', width: 1.5, type: 'dotted'},
                                label: {
                                    show: true,
                                    position: 'end',
                                    formatter: 'Baseline',
                                    color: '#000000'
                                }
                            }
                        ],
                        symbol: 'none'
                    }
                }
            ];
            """
            
        else: 
            #includes: %, score and %_cumulative

            varData = """
            // Initialize the echarts instance based on the prepared dom
            var myChart = echarts.init(document.getElementById('main'));

            // Apply Montserrat font to ECharts container
            document.getElementById('main').style.fontFamily ='Montserrat, sans-serif';

            // Prepare data
            var data = [
                {
                name: '"""+kpi.title()+"""',
                type: 'line',
                data: """+str(inputDict['graphValues']['values'])+""",
                itemStyle: {color: '"""+inputDict['graphValues']['palette0']+"""'},
                markLine: {
                    silent: true,
                    data: [
                        {
                            yAxis: """+str(inputDict['graphValues']['valuesMean'])+""",
                            lineStyle: {color: '#D00071', width: 1.5, type: 'dotted'},
                            label: {
                                show: true,
                                position: 'end',
                                formatter: 'Mean',
                                color: '#000000'
                            }
                        },
                        {
                            yAxis: """+str(inputDict['graphValues']['target'])+""",
                            lineStyle: {color: '#D00071', width: 1.5, type: 'dotted'},
                            label: {
                                show: true,
                                position: 'end',
                                formatter: 'Target',
                                color: '#000000'
                            }
                        },
                        {
                            yAxis: """+str(inputDict['graphValues']['baseline'])+""",
                            lineStyle: {color: '#D00071', width: 1.5, type: 'dotted'},
                            label: {
                                show: true,
                                position: 'end',
                                formatter: 'Baseline',
                                color: '#000000'
                            }
                        }
                    ],
                    symbol: 'none'
                }
            }
            ];"""
            
            
        varOptions = """
        // Configure chart options
        var option = {
            title: {
                text: '"""+kpi+"""',
                textStyle: {
                    fontFamily: 'Montserrat',
                    fontSize: 12
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    return params[0].axisValueLabel + '<br/>' +
                        params.map(function (item) {
                            return item.marker + ' ' + item.seriesName + ': ' + item.data;
                        }).join('<br/>');
                },
                textStyle: {
                    fontFamily: 'Montserrat',
                    fontSize: 12
                }
            },
            legend: {
                show: false,
                data: ['"""+kpi+"""'], //KPIs
                bottom: 0,
                textStyle: {
                    fontFamily: 'Montserrat'
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: """+str(inputDict['graphValues']['monthsRange'])+""", //MONTHS
                axisLabel: {
                    textStyle: {
                        fontFamily: 'Montserrat'
                    }
                }
            },
            yAxis: {
                type: 'value',
                scale: true,  
                name: '""" + unit + """',  // Add this line to label the y-axis
                max : """+str(inputDict['graphValues']['maxValueY'])+""",
                min : """+str(inputDict['graphValues']['minValueY'])+""",
                //nameLocation: 'center',
                //nameGap: 50,
                nameTextStyle: {   // Optional: Style the y-axis label
                    color: '#000',
                    fontFamily: 'Montserrat',
                    fontSize: 14
                },
                axisLabel: {
                    textStyle: {
                        fontFamily: 'Montserrat'
                    }
                }
            },
            series: data
        };

        // Display the chart using the configuration items and data just specified.
        myChart.setOption(option);
        """
        codeSnippetJS = varData + varOptions
        
    # define bar plots, stacked or not (quarter and/or % KPIs)
    elif periodicity == 'quarter':
            
        if  unit == 'chf' or unit == 'amount':

            varData = """
            // Initialize the echarts instance based on the prepared dom
            var myChart = echarts.init(document.getElementById('main'));

            // Apply Montserrat font to ECharts container
            document.getElementById('main').style.fontFamily ='Montserrat, sans-serif';

            // Prepare data
            var data = [
                {
                name: 'Cumulative',
                    type: 'line',
                    data: """+str(inputDict['graphValues']['valuesCum'])+""", // Add cumulative data here
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(208, 0, 113, 0.5)' // color at 0% position
                                }, {
                                    offset: 1, color: 'rgba(208, 0, 113, 0)' // color at 100% position
                                }],
                                global: false // false by default
                            }
                        },  
                    itemStyle: {color: '"""+inputDict['graphValues']['palette1']+"""'}  
                },
                {
                name: '"""+kpi+"""',
                type: 'bar', stack: 'total',
                data: """+str(inputDict['graphValues']['values'])+""",
                itemStyle: {color: '"""+inputDict['graphValues']['palette0']+"""'},
                markLine: {
                    silent: true,
                    data: [
                        {
                            yAxis: """+str(inputDict['graphValues']['target'])+""",
                            lineStyle: {color: '#D00071', width: 1.5, type: 'dotted'},
                            label: {
                                show: true,
                                position: 'end',
                                formatter: 'Target',
                                color: '#000000'
                            }
                        },
                        {
                            yAxis: """+str(inputDict['graphValues']['baseline'])+""",
                            lineStyle: {color: '#D00071', width: 1.5, type: 'dotted'},
                            label: {
                                show: true,
                                position: 'end',
                                formatter: 'Baseline',
                                color: '#000000'
                            }
                        }
                    ],
                    symbol: 'none'
                }
            },

            ];
            """
            
        elif unit == '%_cumulative':
            # values aggregated by default
            
            varData = """
            // Initialize the echarts instance based on the prepared dom
            var myChart = echarts.init(document.getElementById('main'));

            // Apply Montserrat font to ECharts container
            document.getElementById('main').style.fontFamily ='Montserrat, sans-serif';

            // Prepare data
            var data = [
                {
                name: '"""+kpi.title()+"""',
                type: 'bar', 
                data: """+str(inputDict['graphValues']['values'])+""",
                itemStyle: {color: '"""+inputDict['graphValues']['palette0']+"""'},
                markLine: {
                    silent: true,
                    data: [
                        {
                            yAxis: """+str(inputDict['graphValues']['target'])+""",
                            lineStyle: {color: '#D00071', width: 1.5, type: 'dotted'},
                            label: {
                                show: true,
                                position: 'end',
                                formatter: 'Target',
                                color: '#000000'
                            }
                        },
                        {
                            yAxis: """+str(inputDict['graphValues']['baseline'])+""",
                            lineStyle: {color: '#D00071', width: 1.5, type: 'dotted'},
                            label: {
                                show: true,
                                position: 'end',
                                formatter: 'Baseline',
                                color: '#000000'
                            }
                        }
                    ],
                    symbol: 'none'
                }
            },
            {
            name: 'Cumulative',
                type: 'line',
                data: """+str(inputDict['graphValues']['values'])+""", // Add cumulative data here
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(208, 0, 113, 0.5)' // color at 0% position
                            }, {
                                offset: 1, color: 'rgba(208, 0, 113, 0)' // color at 100% position
                            }],
                            global: false // false by default
                        }
                    },  
                itemStyle: {color: '"""+inputDict['graphValues']['palette1']+"""'}  
            }
            ];
            """
        else:
            # applies to % and score. No aggregation
        
            varData = """
            // Initialize the echarts instance based on the prepared dom
            var myChart = echarts.init(document.getElementById('main'));

            // Apply Montserrat font to ECharts container
            document.getElementById('main').style.fontFamily ='Montserrat, sans-serif';

            // Prepare data
            var data = [
                {
                name: '"""+kpi.title()+"""',
                type: 'bar', stack: 'total',
                data: """+str(inputDict['graphValues']['values'])+""",
                itemStyle: {color: '"""+inputDict['graphValues']['palette0']+"""'},
                markLine: {
                    silent: true,
                    data: [
                        {
                            yAxis: """+str(inputDict['graphValues']['valuesMean'])+""",
                            lineStyle: {color: '#D00071', width: 1.5, type: 'dotted'},
                            label: {
                                show: true,
                                position: 'end',
                                formatter: 'Mean',
                                color: '#000000'
                            }
                        },
                        {
                            yAxis: """+str(inputDict['graphValues']['target'])+""",
                            lineStyle: {color: '#D00071', width: 1.5, type: 'dotted'},
                            label: {
                                show: true,
                                position: 'end',
                                formatter: 'Target',
                                color: '#000000'
                            }
                        },
                        {
                            yAxis: """+str(inputDict['graphValues']['baseline'])+""",
                            lineStyle: {color: '#D00071', width: 1.5, type: 'dotted'},
                            label: {
                                show: true,
                                position: 'end',
                                formatter: 'Baseline',
                                color: '#000000'
                            }
                        }
                    ],
                    symbol: 'none'
                }
            }
            ];
            """
        
        varOptions = """
        // Configure chart options
        var option = {
            title: {
                text: '"""+kpi.title()+"""',
                textStyle: {
                    fontFamily: 'Montserrat',
                    fontSize: 12
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    return params[0].axisValueLabel + '<br/>' +
                        params.map(function (item) {
                            return item.marker + ' ' + item.seriesName + ': ' + item.data;
                        }).join('<br/>');
                },
                textStyle: {
                    fontFamily: 'Montserrat',
                    fontSize: 12
                }
            },
            legend: {
                show: false,
                data: ['"""+kpi+"""'], //KPIs
                bottom: 0,
                textStyle: {
                    fontFamily: 'Montserrat'
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: """+str(inputDict['graphValues']['monthsRange'])+""", //MONTHS
                axisLabel: {
                    textStyle: {
                        fontFamily: 'Montserrat'
                    }
                }
            },
            yAxis: {
                type: 'value',
                scale: true,  
                name: '""" + unit + """',  // Add this line to label the y-axis
                max : """+str(inputDict['graphValues']['maxValueY'])+""",
                min : """+str(inputDict['graphValues']['minValueY'])+""",
                //nameLocation: 'center',
                //nameGap: 50,
                nameTextStyle: {   // Optional: Style the y-axis label
                    color: '#000',
                    fontFamily: 'Montserrat',
                    fontSize: 14
                },
                axisLabel: {
                    textStyle: {
                        fontFamily: 'Montserrat'
                    }
                }
            },
            series: data
        };

        // Display the chart using the configuration items and data just specified.
        myChart.setOption(option);
        """
        codeSnippetJS = varData + varOptions
        
    # define gauge plots for GAUGES (yearly KPIs)  
    elif periodicity == 'year':
        
        codeSnippetJS = """
        // Initialize the echarts instance based on the prepared dom
        var myChart = echarts.init(document.getElementById('main'));

        // Apply Montserrat font to ECharts container
        document.getElementById('main').style.fontFamily = 'Montserrat, sans-serif';

        // Prepare data
        var value ="""+str(inputDict['graphValues']['values'])+""";  // This is the value to be displayed on the gauge

        // Configure chart options
        var option = {
            title: {
                text: '"""+kpi.title()+"""',
                textStyle: {
                    fontFamily: 'Montserrat',
                    fontSize: 12
                }
            },
            tooltip: {
                formatter: '{a} <br/>{b} : {c}%'
            },
            series: [
                {
                    name: 'Net Promoter Score', //Kpi Name here
                    type: 'gauge',
                    center: ['50%', '60%'],
                    startAngle: 180,
                    endAngle: 0,
                    min: """+str(inputDict['graphValues']['baseline'])+""",
                    max: """+str(inputDict['graphValues']['target'])+""",
                    splitNumber: 10,
                    itemStyle: {
                        color: (value < -33) ? '#D63503' : (value < 33) ? '#FBBB21' : '#1C6420'  // Conditional color based on value
                    },
                    progress: {
                        show: true,
                        width: 40
                    },
                    pointer: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            width: 40,
                            color: [[1, '#E0E0E0']]  // Background color set to light gray
                        }
                    },
                    axisTick: {
                        distance: -55,
                        splitNumber: 10,
                        lineStyle: {
                            width: 1,
                            color: '#999'
                        }
                    },
                    splitLine: {
                        distance: -60,
                        length: 14,
                        lineStyle: {
                            width: 2,
                            color: '#999'
                        }
                    },
                    axisLabel: {
                        distance: 5,
                        color: '#999',
                        fontSize: 10,
                        fontFamily: 'Montserrat'
                    },
                    anchor: {
                        show: false
                    },
                    title: {
                        show: true
                    },
                    detail: {
                        valueAnimation: true,
                        width: '60%',
                        lineHeight: 40,
                        borderRadius: 8,
                        offsetCenter: [0, '-15%'],
                        fontSize: 30,
                        fontWeight: 'bolder',
                        fontFamily: 'Montserrat',
                        formatter: '{value} """+extractInitials(kpi)+"""', //Kpi Name here
                        color: 'inherit'
                    },
                    data: [
                        {
                            value: value,
                            itemStyle: {
                                color: (value < -33) ? '#D63503' : (value < 33) ? '#FBBB21' : '#1C6420'  // Conditional color based on value
                            }
                        }
                    ]
                }
            ]
        };

        // Display the chart using the configuration items and data just specified.
        myChart.setOption(option);
        """
    return codeSnippetJS



def metricsViz(inputDict):
    """
    Produce JS code to plot the data
    Args:   inputDict (dict) contianing graphID and graphValues keys, containing each a dictionary
            both dictionaries will feed the required values to generate the code
    Returns: JS code (str)
    """
    circle = inputDict['graphID']['circle']
    kpis = inputDict['graphID']['kpis']
    plot = inputDict['graphID']['plot']
    option = inputDict['graphID']['option']

    if plot == 'bar':
        # shows stacked cumulative progress over time
        
        codeSnippetJS = """
        // Initialize the echarts instance based on the prepared dom
        var myChart = echarts.init(document.getElementById('main'));

        // Apply Montserrat font to ECharts container
        document.getElementById('main').style.fontFamily = 'Montserrat, sans-serif';
        
        var option = {
            title: {
                text: 'Stacked """+option+""" (%) Per KPI Over Time',  // Add this line to set the title
                left: '0%',  // Optional: Align the title
                top: 'top',  // Optional: Set the position of the title
                textStyle: {  // Optional: Style the title
                    color: '#000',
                    fontFamily: 'Montserrat',
                    fontSize: 12
                }                
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                // Use axis to trigger tooltip
                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                },
                textStyle: { 
                    fontFamily: 'Montserrat'
                }
            },
            legend: {
                top: 35, //use this to move legend below title
                type: 'scroll',
                itemGap: 30, // space between legend items
                textStyle: {  // Added textStyle attribute here to set the font for legend text
                    fontFamily: 'Montserrat',
                    fontSize: 10   
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '30%',  // Increased the space between the grid and the title
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: """+str(inputDict['graphValues']['monthsRange'])+""",
                axisLabel: {  // Added axisLabel attribute here to set the font for axis labels
                    fontFamily: 'Montserrat'
                }
            },
            yAxis: {
                type: 'value',
                name: '"""+option+"""',
                nameLocation: 'center',
                nameGap: 50,
                nameTextStyle: {
                    color: '#000',
                    fontSize: 14,
                    fontFamily: 'Montserrat'  // Added fontFamily here
                },
                axisLabel: {  // Added axisLabel attribute here to set the font for axis labels
                    fontFamily: 'Montserrat'
                }
            },
            series: [ """+inputDict['graphValues']['kpiMetricsString']+"""
            ]
        };
        
        var myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(option);
        """
    elif plot == 'circular':
        #circular bars, represent cumulative progress on separate kpis of the same circle
        
        codeSnippetJS = """
        // Initialize the echarts instance based on the prepared dom
        var myChart = echarts.init(document.getElementById('main'));

        // Apply Montserrat font to ECharts container
        document.getElementById('main').style.fontFamily = 'Montserrat, sans-serif';
        
        var option = {
            title: [
                {
                    text: 'Average """+option+""" (%) Per KPI',
                    left: '0%',  // Optional: Align the title
                    top: 'top',  // Optional: Set the position of the title
                    textStyle: {
                        color: '#000',
                        fontFamily: 'Montserrat',
                        fontSize: 12
                    },
                    left: '0%'
                }
            ],
            series: {
                name: 'Progress',
                type: 'bar',
                data: ["""+inputDict['graphValues']['kpiMetricsString']+"""
                ],
                coordinateSystem: 'polar',
                label: {
                    show: false,
                    position: 'middle',
                    formatter: '{b}: {c}',
                    textStyle: {
                        fontFamily: 'Montserrat'
                    }
                }
            },
            tooltip: { // formated here to show round values at display
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                textStyle: { 
                    fontFamily: 'Montserrat'
                },
                formatter: function(params) {
                    var tip = params[0].axisValueLabel + '<br>';
                    params.forEach(function(param) {
                        tip += param.marker + ' ' + param.seriesName + ': ' + Math.round(param.value) + '<br>';
                    });
                    return tip;
                }
            },
            
            polar: {
                radius: [20, '70%']
            },
            angleAxis: {
                max: 100,
                startAngle: 90,
                axisLabel: {
                    textStyle: {
                        fontFamily: 'Montserrat'
                    }
                }
            },
            radiusAxis: {
                type: 'category',
                data: """+str(kpis)+""", // introduce kpi names for circle
                show: false, // hide labels in front of bars, too messy
                axisLabel: {
                    textStyle: {
                        fontFamily: 'Montserrat'
                    }
                }
            }
        };

        var myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(option);    
        """
        
    elif plot == 'donut':
        # the donut shows an average progress for the whole circle

        codeSnippetJS = """
        // Initialize the echarts instance based on the prepared dom
        var myChart = echarts.init(document.getElementById('main'));

        // Apply Montserrat font to ECharts container
        document.getElementById('main').style.fontFamily = 'Montserrat, sans-serif';

        var value = """+str(inputDict['graphValues']['value'])+""".toString();  // This is the value you want to display

        var option = {
            title: [
                {
                    text: 'Average """+option+""" (%) For Entire Circle, All KPIs Included',
                    left: '0%',  
                    top: 'top',  
                    textStyle: {
                        color: '#000',
                        fontFamily: 'Montserrat',
                        fontSize: 12
                    }
                }
            ],
            tooltip: {
                trigger: 'item',
                textStyle: { 
                    fontFamily: 'Montserrat'
                },
                formatter: function(params) {
                    return params.name + ': ' + params.value.toFixed(1) + '%';
                }
            },
            series: [
                {
                    name: '"""+option+"""',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    data: [
                        {value: """+str(inputDict['graphValues']['value'])+""", name: '"""+option+"""', itemStyle: {color: '#E5A200'}},
                        // This data entry will represent the unfilled portion of the donut
                        {value: """""+str(inputDict['graphValues']['target']-inputDict['graphValues']['value'])+""", name: 'Remaining', itemStyle: {color: '#F0EEEB'}}
                    ],
                    label: {
                        show: true,
                        position: 'center',
                        formatter: function(params) {
                            return params.value.toFixed(1) + '%';  // Updated to round the values displayed in the center
                        },
                        fontSize: 30,
                        fontWeight: 'bolder',
                        fontFamily: 'Montserrat',
                        color: 'inherit'
                    }
                }
            ]
        };            
        myChart.setOption(option);   
        """

    elif plot == 'radial':
        # progres metric from year start until selected month, all kpis, all circles
        
        codeSnippetJS = """
        // Initialize the echarts instance based on the prepared dom
        var myChart = echarts.init(document.getElementById('main'));

        // Apply Montserrat font to ECharts container
        document.getElementById('main').style.fontFamily = 'Montserrat, sans-serif';

        // Configure chart options
        option = {
            textStyle: {
                fontFamily: 'Montserrat'
            },
            title: [
                {
                    text: 'Collective """+option+""" (%), All Circles And KPIs Included',
                    left: '0%',  // Adjusted: Align the title to the left
                    top: 'top',
                    textStyle: {
                        color: '#000',
                        fontFamily: 'Montserrat',  // Adjusted: Set the font to Montserrat
                        fontSize: 12  // Adjusted: Set the font size
                    }
                }
            ],
            legend: {
                show: true,
                top: 35,  // Adjust this value based on the actual height of your title
                type: 'scroll',
                padding: [5, 10],
                orient: 'horizontal',  // Change the orientation to horizontal
                left: 'center',        // Center the legend
                textStyle: {
                    fontSize: 10  // Adjusted the legend font size here
                },
            },
            tooltip: {
                trigger: 'item',
                textStyle: { 
                    fontFamily: 'Montserrat'
                },
                formatter: function(params) {
                    return params.name + '<br>' + params.marker + ' ' + Math.round(params.value);
                }
            },
            toolbox: {
                show: false,
                feature: {
                mark: { show: false },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
                }
            },
            series: [
                {
                name: 'KPIs Progress',
                type: 'pie',
                radius: [20, 150],
                center: ['50%', '60%'],
                roseType: 'area',
                label: {
                    position: 'outside',  // Place labels outside the pie chart
                    formatter: '{b}: {d}%',  // Display the name and percentage
                    color: '#000', // Set label text color
                    fontSize: 0 //hide for now
                },
                labelLine: {
                    show: false,  // Display the label line
                    length: 15,  // Length of the line from the pie to the label
                    length2: 10  // Length from the end of the first line to the label
                },
                itemStyle: {
                    borderRadius: 0
                },
                data: ["""+inputDict['graphValues']['kpiMetricsString']+"""],
                },

            ]
        };
        myChart.setOption(option);
        """
    return codeSnippetJS


def metricsGatekeeperViz(inputDict):
    """
    Produce JS code to plot the data
    Args:   inputDict (dict) contianing graphID and graphValues keys, containing each a dictionary
            both dictionaries will feed the required values to generate the code
    Returns: JS code (str)
    """
    
    plot = inputDict['graphID']['plot']
    option = inputDict['graphID']['option']
    
    if plot == 'bar':
        
        codeSnippetJS = """
        // Initialize the echarts instance based on the prepared dom
        var myChart = echarts.init(document.getElementById('main'));

        // Apply Montserrat font to ECharts container
        document.getElementById('main').style.fontFamily = 'Montserrat, sans-serif';
        
        var option = {
            title: {
                text: 'Stacked """+option+""" (%) Of All Circles Over Time',  // Add this line to set the title
                left: '0%',  // Optional: Align the title
                top: 'top',  // Optional: Set the position of the title
                textStyle: {  // Optional: Style the title
                    color: '#000',
                    fontFamily: 'Montserrat',
                    fontSize: 12
                }                
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                // Use axis to trigger tooltip
                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                },
                textStyle: { 
                    fontFamily: 'Montserrat'
                }
            },
            legend: {
                top: 35, //use this to move legend below title
                type: 'scroll',
                itemGap: 30, // space between legend items
                textStyle: {  // Added textStyle attribute here to set the font for legend text
                    fontFamily: 'Montserrat',
                    fontSize: 10   
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '30%',  // Increased the space between the grid and the title
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: """+str(inputDict['graphValues']['monthsRange'])+""",
                axisLabel: {  // Added axisLabel attribute here to set the font for axis labels
                    fontFamily: 'Montserrat'
                }
            },
            yAxis: {
                type: 'value',
                name: '"""+option+"""',
                nameLocation: 'center',
                nameGap: 50,
                nameTextStyle: {
                    color: '#000',
                    fontSize: 14,
                    fontFamily: 'Montserrat'  // Added fontFamily here
                },
                axisLabel: {  // Added axisLabel attribute here to set the font for axis labels
                    fontFamily: 'Montserrat'
                }
            },
            series: [ """+inputDict['graphValues']['circleMetricsString']+"""
            ]
        };
        
        var myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(option);
        """
        
    if plot == 'line':
        
        codeSnippetJS = """
        // Initialize the echarts instance based on the prepared dom
        var myChart = echarts.init(document.getElementById('main'));

        // Apply Montserrat font to ECharts container
        document.getElementById('main').style.fontFamily = 'Montserrat, sans-serif';
        
        var option = {
            title: {
                text: 'Historical """+option+""" (%) Per Circle Over Time',  // Add this line to set the title
                left: '0%',  // Optional: Align the title
                top: 'top',  // Optional: Set the position of the title
                textStyle: {  // Optional: Style the title
                    color: '#000',
                    fontFamily: 'Montserrat',
                    fontSize: 12
                }                
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                // Use axis to trigger tooltip
                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                },
                textStyle: { 
                    fontFamily: 'Montserrat'
                }
            },
            legend: {
                top: 35, //use this to move legend below title
                type: 'scroll',
                itemGap: 30, // space between legend items
                textStyle: {  // Added textStyle attribute here to set the font for legend text
                    fontFamily: 'Montserrat',
                    fontSize: 10   
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '30%',  // Increased the space between the grid and the title
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: """+str(inputDict['graphValues']['monthsRange'])+""",
                axisLabel: {  // Added axisLabel attribute here to set the font for axis labels
                    fontFamily: 'Montserrat'
                }
            },
            yAxis: {
                type: 'value',
                name: '"""+option+"""',
                nameLocation: 'center',
                nameGap: 50,
                nameTextStyle: {
                    color: '#000',
                    fontSize: 14,
                    fontFamily: 'Montserrat'  // Added fontFamily here
                },
                axisLabel: {  // Added axisLabel attribute here to set the font for axis labels
                    fontFamily: 'Montserrat'
                }
            },
            series: [ """+inputDict['graphValues']['circleMetricsString']+"""
            ]
        };
        
        var myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(option);
        """
        
    elif plot == 'circular':
        # cumulative progress per circle
        
        codeSnippetJS = """
        // Initialize the echarts instance based on the prepared dom
        var myChart = echarts.init(document.getElementById('main'));

        // Apply Montserrat font to ECharts container
        document.getElementById('main').style.fontFamily = 'Montserrat, sans-serif';
        
        var option = {
            title: [
                {
                    text: 'Average """+option+""" (%) Per Circle',  // Add this line to set the title
                    left: '0%',  // Optional: Align the title
                    top: 'top',  // Optional: Set the position of the title
                    textStyle: {
                        color: '#000',
                        fontFamily: 'Montserrat',
                        fontSize: 12
                    },
                    left: '0%'
                }
            ],
            series: {
                name: 'Progress',
                type: 'bar',
                data: ["""+inputDict['graphValues']['circleMetricsString']+"""
                ],
                coordinateSystem: 'polar',
                label: {
                    show: false,
                    position: 'middle',
                    formatter: '{b}: {c}',
                    textStyle: {
                        fontFamily: 'Montserrat'
                    }
                }
            },
            tooltip: { // formated here to show round values at display
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                textStyle: { 
                    fontFamily: 'Montserrat'
                },
                formatter: function(params) {
                    var tip = params[0].axisValueLabel + '<br>';
                    params.forEach(function(param) {
                        tip += param.marker + ' ' + param.seriesName + ': ' + Math.round(param.value) + '<br>';
                    });
                    return tip;
                }
            },
            polar: {
                radius: [30, '70%']
            },
            angleAxis: {
                max: 100,
                startAngle: 90,
                axisLabel: {
                    textStyle: {
                        fontFamily: 'Montserrat'
                    }
                }
            },
            radiusAxis: {
                type: 'category',
                data: """+str(inputDict['graphID']['circles'])+""", // introduce names for circles
                show: false, // hide labels in front of bars, too messy
                axisLabel: {
                    textStyle: {
                        fontFamily: 'Montserrat'
                    }
                }
            }
        };

        var myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(option);    
        """
        
    elif plot == 'donut':
        # average of progress for all circles
        
        codeSnippetJS = """
        // Initialize the echarts instance based on the prepared dom
        var myChart = echarts.init(document.getElementById('main'));

        // Apply Montserrat font to ECharts container
        document.getElementById('main').style.fontFamily = 'Montserrat, sans-serif';

        var value = """+str(inputDict['graphValues']['valuesMean'])+""";  // This is the value you want to display

        var option = {
            title: [
                {
                    text: 'Average """+option+""" (%) For Projuventute, All Circles Included',
                    left: '0%',  
                    top: 'top',  
                    textStyle: {
                        color: '#000',
                        fontFamily: 'Montserrat',
                        fontSize: 12
                    }
                }
            ],
            tooltip: {
                trigger: 'item',
                textStyle: { 
                    fontFamily: 'Montserrat'
                },
                formatter: function(params) {
                    return params.name + ': ' + params.value.toFixed(1) + '%';
                }
            },
            series: [
                {
                    name: '"""+option+"""',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    data: [
                        {value: """+str(inputDict['graphValues']['valuesMean'])+""", name: '"""+option+"""', itemStyle: {color: '#E5A200'}},
                        // This data entry will represent the unfilled portion of the donut
                        {value: """""+str(inputDict['graphValues']['target']-inputDict['graphValues']['valuesMean'])+""", name: 'Remaining', itemStyle: {color: '#F0EEEB'}}
                    ],
                    label: {
                        show: true,
                        position: 'center',
                        formatter: function() {
                            return value.toFixed(1) + '%';  // Updated to round the values displayed in the center
                        },
                        fontSize: 30,
                        fontWeight: 'bolder',
                        fontFamily: 'Montserrat',
                        color: '#FBBB21'
                    }
                }
            ]
        };            
        myChart.setOption(option);   
        """
    
    elif plot == 'radial':

        codeSnippetJS = """
        // Initialize the echarts instance based on the prepared dom
        var myChart = echarts.init(document.getElementById('main'));

        // Apply Montserrat font to ECharts container
        document.getElementById('main').style.fontFamily = 'Montserrat, sans-serif';

        // Configure chart options
        option = {
            textStyle: {
                fontFamily: 'Montserrat'
            },
            title: [
                {
                    text: 'Collective """+option+""" (%), All Circles And KPIs Included',
                    left: '0%',  // Adjusted: Align the title to the left
                    top: 'top',
                    textStyle: {
                        color: '#000',
                        fontFamily: 'Montserrat',  // Adjusted: Set the font to Montserrat
                        fontSize: 12  // Adjusted: Set the font size
                    }
                }
            ],
            legend: {
                show: true,
                top: 35,  // Adjust this value based on the actual height of your title
                type: 'scroll',
                padding: [5, 10],
                orient: 'horizontal',  // Change the orientation to horizontal
                left: 'center',        // Center the legend
                textStyle: {
                    fontSize: 10  // Adjusted the legend font size here
                },
            },
            tooltip: {
                trigger: 'item',
                textStyle: { 
                    fontFamily: 'Montserrat'
                },
                formatter: function(params) {
                    return params.name + '<br>' + params.marker + ' ' + Math.round(params.value);
                }
            },
            toolbox: {
                show: false,
                feature: {
                mark: { show: false },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
                }
            },
            series: [
                {
                name: 'KPIs Progress',
                type: 'pie',
                radius: [20, 150],
                center: ['50%', '60%'],
                roseType: 'area',
                label: {
                    position: 'outside',  // Place labels outside the pie chart
                    formatter: '{b}: {d}%',  // Display the name and percentage
                    color: '#000', // Set label text color
                    fontSize: 0 //hide for now
                },
                labelLine: {
                    show: false,  // Display the label line
                    length: 15,  // Length of the line from the pie to the label
                    length2: 10  // Length from the end of the first line to the label
                },
                itemStyle: {
                    borderRadius: 0
                },
                data: ["""+inputDict['graphValues']['kpiMetricsString']+"""],
                },

            ]
        };
        myChart.setOption(option);
        """
    
    if plot == 'streamgraph':

        codeSnippetJS = """
        // Initialize the echarts instance based on the prepared dom
        var myChart = echarts.init(document.getElementById('main'));

        // Apply Montserrat font to ECharts container
        document.getElementById('main').style.fontFamily = 'Montserrat, sans-serif';

        // Configure chart options
        option = {
            title: {
                text: 'Collective """+option+""" (%) Over Time, All Circles And KPIs Included',
                left: '0%',
                top: 'top',
                textStyle: {
                    color: '#000',
                    fontFamily: 'Montserrat',
                    fontSize: 12
                }
            },
            tooltip: {
                trigger: 'axis',
                textStyle: { 
                    fontFamily: 'Montserrat', 
                    fontSize: 12 
                },
                axisPointer: {
                type: 'line',
                lineStyle: {
                    color: 'rgba(0,0,0,0.2)',
                    width: 1,
                    type: 'solid'
                }
                }
            },

            legend: {
                show: true,
                top: 35,  // Adjust this value based on the actual height of your title
                type: 'scroll',
                padding: [5, 10],
                orient: 'horizontal',  // Change the orientation to horizontal
                left: 'center',        // Center the legend
                textStyle: {
                    fontSize: 10  // Adjusted the legend font size here
                },
                data: """+str(inputDict['graphValues']['allKpis'])+""",
            },
            singleAxis: {
                top: 50,
                bottom: 50,
                axisTick: {},
                axisLabel: {
                    textStyle: {
                        fontFamily: 'Montserrat', 
                        fontSize: 10 
                    }
                },
                type: 'time',
                axisPointer: {
                animation: true,
                label: {
                    show: true,
                    textStyle: {
                        fontFamily: 'Montserrat', 
                        fontSize: 10 
                    }
                }
                },
                splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.2
                }
                }
            },
            series: [
                {
                type: 'themeRiver',
                color: """+str(inputDict['graphValues']['coloursAllKpis'])+""",
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.8)'
                    }
                },
                data: """+str(inputDict['graphValues']['dataAllKpis'])+""",
                label: {
                    show: false,
                    textStyle: {
                        fontFamily: 'Montserrat', 
                        fontSize: 10 
                    }
                }
                }
            ]
        };
        myChart.setOption(option);
        """
    return codeSnippetJS
        




