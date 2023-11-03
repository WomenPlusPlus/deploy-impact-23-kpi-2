import pandas as pd
import numpy as np

# ===========================================================================  
# these functions serve the three main ones, that you will find below
# =========================================================================== 

def calculateMetric(dfLocal,dfGlobal,option):
  """
  Calculates the metrics of progress and perfomance for the given dataframe
  Args:
    dfLocal (pandas df): dataframe with selected time frame, kpi and circle
    dfGlobal (pandas df):  dataframe with all historical data for specific kpi and circle
    option (string): 'progress' or 'performance'
  Returns:
    List of values (list)
  """

  unit = dfLocal['unit'].unique()[0]
  if option == 'progress':
    if unit=='chf' or unit=='amount':
      nominator = (dfLocal['value'].cumsum()-dfLocal['initial_value'])
      denominator = (dfLocal['target_value']-dfLocal['initial_value'])
      metric = nominator/denominator*100
    else:
      nominator = (dfLocal['value']-dfLocal['initial_value'])
      denominator = (dfLocal['target_value']-dfLocal['initial_value'])
      metric = nominator/denominator*100

  elif option == 'performance':  
    if unit=='chf' or unit=='amount':
        denominator = (dfGlobal['value'].cumsum().max()-dfGlobal['value'].cumsum().min())
        if denominator == 0:
          metric = 0
        else:
          nominator = (dfLocal['value'].cumsum()-dfGlobal['value'].cumsum().min())
          metric = nominator/denominator*100
    else: 
        denominator = (dfGlobal['value'].max()-dfGlobal['value'].min())
        if denominator == 0:
          metric = 0
        else:
          nominator = (dfLocal['value']-dfGlobal['value'].min())
          metric = nominator/denominator*100
  return list(metric.round(0))

def breakString(input_string, max_length):
    """
    Breaks a given string at the last space character before the specified maximum length.
    If the input string's length is less than or equal to the max_length, or if there's no 
    space character before the max_length, the function returns the original string.
    
    Args:
      input_string (str): The string to be broken.
      max_length (int): The maximum allowed length of the string before it should be broken.
    
    Returns:
      str: The broken string, if a suitable space character is found before max_length. 
           Otherwise, the original string.
    """
    if len(input_string) <= max_length:
        return input_string
    
    #Find the last occurrence of a space before the max_length
    breakIndex = input_string.rfind(' ', 0, max_length)
    
    if breakIndex == -1:
        return input_string  #Return the original string if no suitable break point is found
    
    # Return the string broken into two lines at the found space
    return input_string[:breakIndex] + '\n' + input_string[breakIndex + 1:]

def dictToJs(obj):
  """
  Convert a Python object to a JS string
  Args:
    obj: Python object
  Returns:
    JS string
  """
  if isinstance(obj, bool):
      return str(obj).lower()
  if isinstance(obj, str):
      return f'"{obj}"'
  if isinstance(obj, (int, float)):
      return str(obj)
  if isinstance(obj, list):
      return '[' + ', '.join(dictToJs(e) for e in obj) + ']'
  if isinstance(obj, dict):
      return '{' + ', '.join(f'{k}: {dictToJs(v)}' for k, v in obj.items()) + '}'
 
 
# ===========================================================================  
# these are the constants required to create the plots
# =========================================================================== 

MONTH_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# palette used for actual data plots
PALETTE_PURPLE=[ '#4E17B0', #Base color
                '#833FFF', 
                '#CFB5FF'] #Lighter shade 
PALETTE_MAGENTA = ['#D00071', #Base color                 
                '#FF79C1',
                '#FFD0E9']#lighter tone
         
# palette used for progress data plots
PALETTE_YELLOW = [   '#e5a200', #Base color                 
                    '#FBBB21',
                    '#FECC33',
                    '#FEF9E9']#lighter tone
                    
# palette used for CIRCLES and kpis
PALETTE_RED = [  '#D63503', #Base color                 
                '#FF8A65',
                '#FCEFEB']#lighter tone

PALETTE_GREEN = ['#1C6420', #Base color                 
                '#66BB6A',
                '#BFEAC0']#lighter tone

PALETTE_CYAN = ['#08C2DB', #Base color                 
                '#93E8F4',
                '#C5F7FD']#lighter tone

PALETTE_BLUE = ['#072490', #Base color                 
                '#6686FF',
                '#B2C3FF']#lighter tone

PALETTE_OLIVE = ['#5B6A00', #Base color
                '#B5D00D',
                '#E8F49A']

PALETTE_TERRACOTA = ['#8C5009', #Base color
                    '#F59019',
                    '#FFCB8D']

# PALETTE_GREY = ['#656565', #Base color                 
#                 '#ABA8A3',
#                 '#F0EEEB']#lighter tone
 
 
# ====================================================================================  
# below are the threee functions you need to create the inputs for the plot functions
# ==================================================================================== 
 
def dataCalculation(df,
                        circle,
                        year,
                        month,
                        palette=[PALETTE_PURPLE,PALETTE_MAGENTA],
                        month_list=MONTH_LIST):
    
    """
    Create list of dictionaries per circle. Each dict contains
    required data to create plots for a specific kpi
    Args:
        df (pandas df): dataframe with columns:
            kpi, circle, periodicity, unit, initial_value, target_value, date, value
            Order by KPI, Circle, Date in ASC order
            Please convert the 'date' column to datetime type "df.date = pd.to_datetime(df.date)"
            
        circle (string): circle name
        year (int): year
        month (int): month
        palette (list): list of color palettes
        month_list (list): list of months
    Returns:
        exportAll (list): list of dictionaries
    """
    
    # make selection from year start until selected month
    dfTemp = df.loc[
        (df.circle == circle) &
        (df.date <= pd.to_datetime(str(year)+'-'+str(month)+'-01'))&
        (df.date >= pd.to_datetime(str(year)+'-01-01'))
        ]
    
    # check for unit chf and periodicity month  >> line plot together
    if  dfTemp.empty == False:

        # find selected kpis
        kpis = dfTemp.kpi.unique().tolist()
        exportAll = []
        for i,k in enumerate(kpis):
        
            # detect baseline, target, periodicity and unit
            baseline = dfTemp.loc[dfTemp.kpi == k,'initial_value'].tolist()[-1]
            target = dfTemp.loc[dfTemp.kpi == k,'target_value'].tolist()[-1]
            periodicity = dfTemp.loc[dfTemp.kpi == k,'periodicity'].unique().tolist()[0]
            unit = dfTemp.loc[dfTemp.kpi == k,'unit'].unique().tolist()[0]
            
            # define line plots for line plots (chf and monthly KPIS)          
            if periodicity == 'month':
                dfTempLocal = dfTemp.loc[(df.kpi == k),['date','value']]
                # define months for monthly graphic
                months = dfTempLocal.date.dt.month.unique()
                monthsRange = month_list[months[0]-1:months[-1]]
                
                if  unit == 'chf'or unit == 'amount':
                    # Create 'aggregated' that cumulatively sums the 'value' column
                    values = dfTempLocal.value.to_list()
                    valuesCum = dfTempLocal['value'].cumsum().to_list()
                    
                    # define max and min value for y axis
                    maxValueY = max(values+[baseline]+[target]+valuesCum)
                    minValueY = min(values+[baseline]+[target])
                               
                    exportDict = {
                        'graphID':{
                            'kpi':k.title(),
                            'periodicity':periodicity,
                            'unit':unit
                        },    
                            'graphValues':{
                                           'values':values,
                                           'palette0':palette[0][0],
                                           'palette1':palette[1][0],
                                           'target':target,
                                           'baseline':baseline,
                                           'valuesCum':valuesCum,
                                           'monthsRange':monthsRange,
                                           'maxValueY':maxValueY,
                                           'minValueY':minValueY
                                           }
                            }
                    exportAll.append(exportDict)
                
                elif  unit == '%_cumulative':
                    # Create the 'aggregated' column that cumulatively sums the 'value' column
                    values = dfTempLocal.value.to_list()
                    
                    # define max and min value for y axis
                    maxValueY = max(values+[baseline]+[target])
                    minValueY = min(values+[baseline]+[target])
                    
                    exportDict = {
                        'graphID':{
                            'kpi':k.title(),
                            'periodicity':periodicity,
                            'unit':unit
                        },
                            'graphValues':{
                                           'values':values,
                                           'palette1':palette[1][0],
                                           'target':target,
                                           'baseline':baseline,
                                           'monthsRange':monthsRange,
                                           'maxValueY':maxValueY,
                                           'minValueY':minValueY
                                           }
                            }
                    exportAll.append(exportDict)
                
                else: 
                    #includes: %, score and %_cumulative
                    values = dfTempLocal.value.to_list()
                    # define max and min value for y axis
                    maxValueY = max(values+[baseline]+[target])
                    minValueY = min(values+[baseline]+[target])
                    valuesMean = np.mean(values)
                                        
                    exportDict = {
                        'graphID':{
                            'kpi':k.title(),
                            'periodicity':periodicity,
                            'unit':unit
                        },
                            'graphValues':{
                                           'values':values,
                                           'palette0':palette[0][0],
                                           'valuesMean':valuesMean,
                                           'target':target,
                                           'baseline':baseline,
                                           'monthsRange':monthsRange,
                                           'maxValueY':maxValueY,
                                           'minValueY':minValueY
                                           }
                            }
                    exportAll.append(exportDict)
                
            # define bar plots, stacked or not (quarter and/or % KPIs)
            elif periodicity == 'quarter':
                dfTempLocal = dfTemp.loc[(df.kpi == k)&
                    (df.date.dt.month.isin([3,6,9,12])),
                    ['date','value']]
                    
                # define months for quarters
                months = dfTempLocal.date.dt.month.unique()
                monthsRange = [month_list[i-1] for i in months]
                    
                if  unit == 'chf' or unit == 'amount':
                    # Create 'aggregated' values that cumulatively sums the 'value' column
                    values = dfTempLocal.value.to_list()
                    valuesCum = dfTempLocal['value'].cumsum().to_list()
                    
                    # define max and min value for y axis
                    maxValueY = max(values+[baseline]+[target]+valuesCum)
                    minValueY = min(values+[baseline]+[target])
                    
                    exportDict = {
                        'graphID':{
                            'kpi':k.title(),
                            'periodicity':periodicity,
                            'unit':unit
                            },
                            'graphValues':{
                                           'values':values,
                                           'valuesCum':valuesCum,
                                           'palette0':palette[0][0],
                                           'palette1':palette[1][0],
                                           'target':target,
                                           'baseline':baseline,
                                           'monthsRange':monthsRange,
                                           'maxValueY':maxValueY,
                                           'minValueY':minValueY
                                           }
                            }
                    exportAll.append(exportDict)
                    
                elif unit == '%_cumulative':
                    # values aggregated by default
                    values = dfTempLocal.value.to_list()
                    
                    # define max and min value for y axis
                    maxValueY = max(values+[baseline]+[target])
                    minValueY = min(values+[baseline]+[target])
                    
                    exportDict = {
                        'graphID':{
                            'kpi':k.title(),
                            'periodicity':periodicity,
                            'unit':unit
                            },
                            'graphValues':{
                                           'values':values,
                                           'palette0':palette[0][0],
                                           'palette1':palette[1][0],
                                           'target':target,
                                           'baseline':baseline,
                                           'monthsRange':monthsRange,
                                           'maxValueY':maxValueY,
                                           'minValueY':minValueY
                                           }
                            }
                    exportAll.append(exportDict)
                    
                else:
                    # applies to % and score. No aggregation
                    values = dfTempLocal.value.to_list()
                    valuesMean = np.mean(values)
                    
                    # define max and min value for y axis
                    maxValueY = max(values+[baseline]+[target])
                    minValueY = min(values+[baseline]+[target])
                
                    exportDict = {
                        'graphID':{
                            'kpi':k.title(),
                            'periodicity':periodicity,
                            'unit':unit
                            },
                            'graphValues':{
                                           'values':values,
                                           'valuesMean':valuesMean,
                                           'palette0':palette[0][0],
                                           'target':target,
                                           'baseline':baseline,
                                           'monthsRange':monthsRange,
                                           'maxValueY':maxValueY,
                                           'minValueY':minValueY
                                           }
                            }
                    exportAll.append(exportDict)
                
            # define gauge plots for GAUGES (yearly KPIs)  
            elif periodicity == 'year':
                dfTempLocal = dfTemp.loc[(df.kpi == k)&
                                    (df.date.dt.month.isin([12])),
                                    ['date','value']]
                if dfTempLocal.empty==True:
                    dfTempLocal = dfTemp.loc[(df.kpi == k)&
                    (df.date.dt.month.isin([month])),
                    ['date','value']]
                    
                # define months for quarters
                months = dfTempLocal.date.dt.month.unique()
                monthsRange = [month_list[i-1] for i in months]
                    
                values = dfTempLocal.value.mean()
                
                exportDict = {
                        'graphID':{
                            'kpi':k.title(),
                            'periodicity':periodicity,
                            'unit':unit
                            },
                            'graphValues':{
                                           'values':values,
                                           'target':target,
                                           'baseline':baseline,
                                           }
                            }
                exportAll.append(exportDict)

        return exportAll 
    else:
        print('there is no values with this combination')
                
                
def metricsCalculation(df,
                  circle,
                  year,
                  month,
                  option = 'progress', #'performance' or 'progress'
                  plot = 'bar', #'circular','donut','radial', 'bar'
                  paletteProgress = PALETTE_YELLOW,
                  palettes=[PALETTE_OLIVE,PALETTE_GREEN,PALETTE_CYAN,
                            PALETTE_BLUE,PALETTE_RED,PALETTE_TERRACOTA],
                  month_list=MONTH_LIST):
    
    """
    Create list of dictionaries per circle. Each dict contains
    required data to create plots of progress for a specific circle.
    Args:
        df (pandas df): dataframe with columns:
            kpi, circle, periodicity, unit, initial_value, target_value, date, value
            Order by KPI, Circle, Date in ASC order
            Please convert the 'date' column to datetime type "df.date = pd.to_datetime(df.date)"
            
        circle (string): circle name
        year (int): year
        month (int): month
        option (string): 'progress' or 'performance' based on metric to be plotted. Progress is default
        plot (string): 'bar','circular','donut','radial' based on plot type
        palettes (list): list of color palettes
        month_list (list): list of months
    Returns:
        exportDict (list): list of dictionaries
    """
    
    # make selection from year start until selected month
    dfTemp = df.loc[
        (df.circle == circle) &
        (df.date <= pd.to_datetime(str(year)+'-'+str(month)+'-01'))&
        (df.date >= pd.to_datetime(str(year)+'-01-01'))
        ]
    dfPerformance = df.loc[
        (df.circle == circle) &
        (df.date <= pd.to_datetime(str(year)+'-'+str(month)+'-01'))
        ]
    
    if  dfTemp.empty == False:
        
        # find selected kpis
        kpis = dfTemp.kpi.unique().tolist()

        if plot == 'bar':
            kpiMetrics = []
            for i,k in enumerate(kpis):
                periodicity = dfTemp.loc[(df.kpi == k),'periodicity'].unique()[0]
                # define time axis global
                monthsRange = [month_list[i] for i in range(month)]
                
                if periodicity == 'month':
                    dfTempLocal = dfTemp.loc[(df.kpi == k)]
                    # calculate on the fly, rather than from df
                    values = calculateMetric(dfTempLocal,
                                             dfPerformance.loc[(dfPerformance.kpi == k)],
                                             option)
          
                elif periodicity == 'quarter':
                    # for now only works with circles that are only quarterly
                    dfTempLocal = dfTemp.loc[(df.kpi == k)&
                                        (df.date.dt.month.isin([3,6,9,12]))]
                    
                    # calculate on the fly, rather than from df
                    values = calculateMetric(dfTempLocal,
                                             dfPerformance.loc[(dfPerformance.kpi == k)],
                                             option)
              
                    # define time axis locally
                    months = dfTempLocal.date.dt.month.unique().tolist()
                    monthsRange = [month_list[i-1] for i in months]
                    
                    # use in the future if needed to adapt to yearly plots
                    # values = [[v]*3 for v in values]
                    # values = [item for sublist in values for item in sublist]
                
                elif periodicity == 'year':
                    dfTempLocal = dfTemp.loc[(df.kpi == k)&
                                (df.date.dt.month.isin([12]))]
                    if dfTempLocal.empty==True:
                        dfTempLocal = dfTemp.loc[(df.kpi == k)&
                        (df.date.dt.month.isin([month]))]
     
                    # calculate on the fly, rather than from df
                    values = calculateMetric(dfTempLocal,
                                             dfPerformance.loc[(dfPerformance.kpi == k)],
                                             option)
              
                    values = [values]*month
                    values = [item for sublist in values for item in sublist]

                kpiMetric = {
                                "name": k.title(),
                                "type": "bar",
                                "stack": "total",
                                "itemStyle": {"color": paletteProgress[i]},
                                "label": {"show": True},
                                "emphasis": {"focus": "series"},
                                "data": values,
                            }        

                # Convert the dictionary to a JSON string with a custom serializer
                kpiMetric = dictToJs(kpiMetric)
                kpiMetrics.append(kpiMetric)
                
            kpiMetricsString = ",".join(kpiMetrics)
            
            exportDict = {
                'graphID':{
                    'circle':circle.title(),
                    'kpis':[k.title() for k in kpis],
                    'plot':plot,
                    'option':option.title()
                },    
                    'graphValues':{
                                    'monthsRange':monthsRange,
                                    'kpiMetricsString':kpiMetricsString
                                    }
                    }

        elif plot == 'circular':
            #circular bars, represent cumulative progress on separate kpis of the same circle
            kpiMetrics = []
            for i,k in enumerate(kpis):
                #take the last month value in the range because cumulative
                # calculate on the fly, rather than from df column
                dfTempLocal = dfTemp.loc[(dfTemp.kpi == k)]
                value = calculateMetric(dfTempLocal,
                                         dfPerformance.loc[(dfPerformance.kpi == k)],
                                         option)[-1]
                
                kpiMetric = {
                    "value": value+0.0001, # add 0.0001 to avoid 0.0, otherwise there will be a bug with the fonts
                    "itemStyle": {"color": paletteProgress[i]}
                            }        

                # Convert the dictionary to a JSON string with a custom serializer
                kpiMetric = dictToJs(kpiMetric)
                kpiMetrics.append(kpiMetric)
                
            kpiMetricsString = ",".join(kpiMetrics)
            
            exportDict = {
                'graphID':{
                    'circle':circle.title(),
                    'kpis':[k.title() for k in kpis],
                    'plot':plot,
                    'option':option.title()
                },    
                    'graphValues':{
                                    'kpiMetricsString':kpiMetricsString
                                    }
                    }
            
        elif plot == 'donut':
            # the donut shows an average progress for the whole circle
            #take the last month value in the range since its cumulative
            values = [calculateMetric(dfTemp.loc[dfTemp.kpi == k],
                                        dfPerformance.loc[(dfPerformance.kpi == k)],
                                        option)[-1] for k in kpis]
            value = np.mean(values)
                
            #baseline = 0
            target = 100
            
            exportDict = {
                'graphID':{
                    'circle':circle.title(),
                    'kpis':[k.title() for k in kpis],
                    'plot':plot,
                    'option':option.title()
                },    
                    'graphValues':{
                                    'value':value,
                                    'target':target,
                                    }
                    }
    
        elif plot == 'radial':
            # select metric from year start until selected month, all circles
            dfTempLocal = df.loc[
                (df.date <= pd.to_datetime(str(year)+'-'+str(month)+'-01'))&
                (df.date >= pd.to_datetime(str(year)+'-01-01'))]
            circles = dfTempLocal.circle.unique().tolist()
            
            kpisAll = []
            kpiMetricsAll = []
            for i,c in enumerate(circles):
                kpisCircle = dfTempLocal.loc[dfTempLocal.circle == c].kpi.unique().tolist()
                # kpisAll.append(kpisCircle)
                kpiMetrics = []
                for j,k in enumerate(kpisCircle):
                    value = calculateMetric(dfTempLocal.loc[(dfTempLocal.kpi == k)],
                                            dfPerformance.loc[(dfPerformance.kpi == k)],
                                            option)[-1]+ 0.0001
                    kpiMetric = {"value": value, "name": k, "itemStyle": {"color": palettes[i][j]}}
                    kpisAll.append("C"+str(i+1)+": "+k)
                    
                    # Convert the dictionary to a JSON string with a custom serializer
                    kpiMetric = dictToJs(kpiMetric)
                    kpiMetrics.append(kpiMetric)
                kpiMetricsAll.append(kpiMetrics)
            
            kpisAll = [breakString(s.replace('/', ' / '), 30) for s in kpisAll]
            kpiMetricsAll = [item for sublist in kpiMetricsAll for item in sublist]
            kpiMetricsString = ",".join(kpiMetricsAll)
            
            exportDict = {
                'graphID':{
                    'circle':circle.title(),
                    'kpis':[k.title() for k in kpis],
                    'plot':plot,
                    'option':option.title()
                },    
                    'graphValues':{
                                    'kpiMetricsString':kpiMetricsString,
                                    }
                    }

        return exportDict
        
    else:
        print('there is no values with this combination')
        

def metricsGatekeeperCalculation(df,
                  year,
                  month,
                  option = 'progress', #'performance' >>> what should be displayed
                  plot = 'bar',#'circular','donut','radial','streamgraph','line'
                  palettes=[PALETTE_OLIVE,PALETTE_GREEN,PALETTE_CYAN,
                            PALETTE_BLUE,PALETTE_RED,PALETTE_TERRACOTA],
                  month_list=MONTH_LIST):
    
    """
    Create dictionary with required data for Gatekeeper metrics plot.
    Each dict produces the plot type defined in the parameter plot. 
    Each plot represents all of projuventute.
    
    Args:
        df (pandas df): dataframe with columns:
            kpi, circle, periodicity, unit, initial_value, target_value, date, value
            Order by KPI, Circle, Date in ASC order
            Please convert the 'date' column to datetime type "df.date = pd.to_datetime(df.date)"
        year (int): year
        month (int): month
        option (string): 'progress' or 'performance' based on metric to be plotted. Progress is default
        plot (string): 'bar','circular','donut','radial','streamgraph','line' based on plot type
        palettes (list): list of color palettes
        month_list (list): list of months
    Returns:
        exportDict (dict): dictionary with required data
    """
    
    # make selection from year start until selected month
    dfTemp = df.loc[
        (df.date <= pd.to_datetime(str(year)+'-'+str(month)+'-01'))&
        (df.date >= pd.to_datetime(str(year)+'-01-01'))]
    dfPerformance = df.loc[(df.date <= pd.to_datetime(str(year)+'-'+str(month)+'-01'))]
    
    if  dfTemp.empty == False:
        # find selected kpis
        circles = dfTemp.circle.unique().tolist()
        # define time axis
        months = dfTemp.date.dt.month.sort_values().unique()
        monthsRange = [month_list[i-1] for i in months]

        if plot == 'bar':
            circleMetrics = []
            for i,c in enumerate(circles):
                kpis = dfTemp[dfTemp.circle == c].kpi.unique().tolist()
                collectValues = []
                for k in kpis:
                    periodicity = dfTemp.loc[(dfTemp.circle == c)
                                             &(df.kpi == k),'periodicity'].unique().tolist()[0]
                    if periodicity == 'month':
                        dfTempLocal = dfTemp.loc[(df.kpi == k)]
                        values = calculateMetric(dfTempLocal,
                                                 dfPerformance.loc[dfPerformance.kpi == k],
                                                 option)
                        collectValues.append(values)
                    
                    elif periodicity == 'quarter':
                        # for now only works with circles that are only quarterly
                        dfTempLocal = dfTemp.loc[(df.kpi == k)&
                                            (df.date.dt.month.isin([3,6,9,12]))]
                        
                        values = calculateMetric(dfTempLocal,
                                                 dfPerformance.loc[dfPerformance.kpi == k],
                                                 option) 
                                               
                        # use if needed to adapt to monthly plots
                        values = [[v]*3 for v in values]
                        values = [item for sublist in values for item in sublist]
                        collectValues.append(values)
                    
                    elif periodicity == 'year':
                        dfTempLocal = dfTemp.loc[(df.kpi == k)&
                                    (df.date.dt.month.isin([12]))]
                        if dfTempLocal.empty==True:
                            dfTempLocal = dfTemp.loc[(df.kpi == k)&
                            (df.date.dt.month.isin([month]))]

                        values = calculateMetric(dfTempLocal,
                                                 dfPerformance.loc[dfPerformance.kpi == k],
                                                 option)
                        values = [values]*month
                        values = [item for sublist in values for item in sublist]
                        collectValues.append(values)
                
                # combine all kpis in a mean value per circle        
                valuesMean = list(np.mean(np.transpose(collectValues),axis=1).round(2))

                circleMetric = {
                                "name": c.title(),
                                "type": "bar",
                                "stack": "total",
                                "itemStyle": {"color": palettes[i][0]},
                                "label": {"show": True},
                                "emphasis": {"focus": "series"},
                                "data": valuesMean,
                                "label": {"show": False}
                                }        

                # Convert the dictionary to a JSON string with a custom serializer
                circleMetric = dictToJs(circleMetric)
                circleMetrics.append(circleMetric)
                
            circleMetricsString = ",".join(circleMetrics)
            exportDict = {
                'graphID':{
                    'plot':plot,
                    'option':option.title()
                },    
                    'graphValues':{
                        'monthsRange':monthsRange,
                        'circleMetricsString':circleMetricsString,
                                    }
                    }
            
        if plot == 'line':
            option = 'performance'
            circleMetrics = []
            for i,c in enumerate(circles):
                # average values for a period of time
                kpis = dfTemp[dfTemp.circle == c].kpi.unique().tolist()
                collectValues = []
                for k in kpis:
                    periodicity = dfTemp.loc[(dfTemp.circle == c)
                                             &(df.kpi == k),'periodicity'].unique().tolist()[0]
                    if periodicity == 'month':
                        dfTempLocal = dfTemp.loc[(df.kpi == k)]
                        values = calculateMetric(dfTempLocal,
                                                 dfPerformance.loc[dfPerformance.kpi == k],
                                                 option)
                        collectValues.append(values)
                    
                    elif periodicity == 'quarter':
                        # for now only works with circles that are only quarterly
                        dfTempLocal = dfTemp.loc[(df.kpi == k)&
                                            (df.date.dt.month.isin([3,6,9,12]))]
                        
                        values = calculateMetric(dfTempLocal,
                                                 dfPerformance.loc[dfPerformance.kpi == k],
                                                 option)                     
                        # use if needed to adapt to monthly plots
                        values = [[v]*3 for v in values]
                        values = [item for sublist in values for item in sublist]
                        collectValues.append(values)
                    
                    elif periodicity == 'year':
                        dfTempLocal = dfTemp.loc[(df.kpi == k)&
                                    (df.date.dt.month.isin([12]))]
                        if dfTempLocal.empty==True:
                            dfTempLocal = dfTemp.loc[(df.kpi == k)&
                            (df.date.dt.month.isin([month]))]

                        values = calculateMetric(dfTempLocal,
                                                 dfPerformance.loc[dfPerformance.kpi == k],
                                                 option)
                        values = [values]*month
                        values = [item for sublist in values for item in sublist]
                        collectValues.append(values)
                
                # combine all kpis in a mean value per circle        
                valuesMean = list(np.mean(np.transpose(collectValues),axis=1).round(2))
                # print(valuesMean)
                circleMetric = {
                                "name": c.title(),
                                "type": "line",
                                "smooth": "True",
                                "itemStyle": {"color": palettes[i][0]},
                                "label": {"show": True},
                                "emphasis": {"focus": "series"},
                                "data": valuesMean,
                                "label": {"show": False}
                                }        

                # Convert the dictionary to a JSON string with a custom serializer
                circleMetric = dictToJs(circleMetric)
                circleMetrics.append(circleMetric)
                
            circleMetricsString = ",".join(circleMetrics)
            exportDict = {
                'graphID':{
                    'plot':plot,
                    'option':option.title()
                },    
                    'graphValues':{
                        'monthsRange':monthsRange,
                        'circleMetricsString':circleMetricsString,
                                    }
                    }
            
        elif plot == 'circular':
            # cumulative progress per circle
            circleMetrics = []
            for i,c in enumerate(circles):
                # take the last value for each circle because cumulative
                kpis = dfTemp.loc[(dfTemp.circle == c)].kpi.unique().tolist()
                values = [calculateMetric(dfTemp.loc[(dfTemp.kpi == k)],
                                        dfPerformance.loc[(dfPerformance.kpi == k)],
                                        option)[-1] for k in kpis]
                value = np.mean(values)
                
                circleMetric = {
                    "value": value+0.0001, # add 0.0001 to avoid 0.0, otherwise there will be a bug with the fonts
                    "itemStyle": {"color": palettes[i][0]}
                            }        

                # Convert the dictionary to a JSON string with a custom serializer
                circleMetric = dictToJs(circleMetric)
                circleMetrics.append(circleMetric)
                
            circleMetricsString = ",".join(circleMetrics)
            exportDict = {
                'graphID':{
                    'plot':plot,
                    'option':option.title(),
                    'circles':circles,
                },    
                    'graphValues':{
                        'monthsRange':monthsRange,
                        'circleMetricsString':circleMetricsString,
                                    }
                    }
            
        elif plot == 'donut':
            # average of progress for all circles
            # take the last month value in the range
            circleMetrics = []
            for i,c in enumerate(circles):
                # take the last value for each circle because cumulative
                kpis = dfTemp.loc[(dfTemp.circle == c)].kpi.unique().tolist()
                values = [calculateMetric(dfTemp.loc[(dfTemp.kpi == k)],
                                        dfPerformance.loc[(dfPerformance.kpi == k)],
                                        option)[-1] for k in kpis]
                circleMetrics.append(np.mean(values))
            
            valuesMean = np.mean(circleMetrics).round(0)
            # baseline = 0
            target = 100
            
            exportDict = {
                'graphID':{
                    'plot':plot,
                    'option':option.title(),
                },    
                    'graphValues':{
                        'valuesMean':valuesMean,
                        'target':target,
                                    }
                    }
        
        elif plot == 'radial':
            # select metric from year start until selected month, all circles
            dfTempLocal = df.loc[
                (df.date <= pd.to_datetime(str(year)+'-'+str(month)+'-01'))&
                (df.date >= pd.to_datetime(str(year)+'-01-01'))]
            circles = dfTempLocal.circle.unique().tolist()
            
            kpisAll = []
            kpiMetricsAll = []
            for i,c in enumerate(circles):
                kpisCircle = dfTemp.loc[dfTemp.circle == c].kpi.unique().tolist()
                # kpisAll.append(kpisCircle)
                kpiMetrics = []
                for j,k in enumerate(kpisCircle):
                    value = calculateMetric(dfTempLocal.loc[(dfTempLocal.kpi == k)],
                                            df.loc[(df.kpi == k)],
                                            option)[-1]+ 0.0001
                    kpiMetric = {"value": value, "name": k, "itemStyle": {"color": palettes[i][j]}}
                    kpisAll.append("C"+str(i+1)+": "+k)
                    
                    # Convert the dictionary to a JSON string with a custom serializer
                    kpiMetric = dictToJs(kpiMetric)
                    kpiMetrics.append(kpiMetric)
                kpiMetricsAll.append(kpiMetrics)
            
            # kpisAll = [item for sublist in kpisAll for item in sublist] #flatten list if needed
            # format string with line breaks for labels
            kpisAll = [breakString(s.replace('/', ' / '), 30) for s in kpisAll]
            kpiMetricsAll = [item for sublist in kpiMetricsAll for item in sublist]
            kpiMetricsString = ",".join(kpiMetricsAll)
            
            exportDict = {
                'graphID':{
                    'plot':plot,
                    'option':option.title(),
                },    
                    'graphValues':{
                        'kpiMetricsString':kpiMetricsString,
                                    }
                    }
            
        
        if plot == 'streamgraph':
            # cumulative progress all circles per kpi with time vector
            dataAllKpis = [] 
            allKpis = []
            coloursAllKpis = [] 
            # define all dates from january until selected month
            dates = dfTemp.sort_values('date').loc[:,'date'].unique().tolist()
            dates = [d.strftime('%Y-%m') for d in dates]
         
            for i,c in enumerate(circles):
                
                kpis = dfTemp.loc[dfTemp.circle == c].kpi.unique().tolist()
                for j,k in enumerate(kpis):
                    periodicity = dfTemp.loc[(dfTemp.circle == c)&
                                             (df.kpi == k),'periodicity'].unique().tolist()[0]
                    
                    if periodicity == 'month':
                        dfTempLocal = dfTemp.loc[(df.kpi == k)]
                        values = calculateMetric(dfTempLocal,
                                                 dfPerformance.loc[dfPerformance.kpi == k],
                                                 option)
                    
                    elif periodicity == 'quarter':
                        # for now only works with circles that are only quarterly
                        dfTempLocal = dfTemp.loc[(df.kpi == k)&
                                            (df.date.dt.month.isin([3,6,9,12]))]
                        
                        values = calculateMetric(dfTempLocal,
                                                 dfPerformance.loc[dfPerformance.kpi == k],
                                                 option)                       
                        # use if needed to adapt to monthly plots
                        values = [[v]*3 for v in values]
                        values = [item for sublist in values for item in sublist]
                    
                    elif periodicity == 'year':
                        dfTempLocal = dfTemp.loc[(df.kpi == k)&
                                    (df.date.dt.month.isin([12]))]
                        
                        if dfTempLocal.empty==True:
                            dfTempLocal = dfTemp.loc[(df.kpi == k)&
                            (df.date.dt.month.isin([month]))]
                        
                        values = calculateMetric(dfTempLocal,
                                                 dfPerformance.loc[dfPerformance.kpi == k],
                                                 option)
                        # use if needed to adapt to monthly plots
                        values = [values]*month
                        values = [item for sublist in values for item in sublist]
                    
                    data = list(zip(dates, values, [k]*len(dates)))
                    data = [list(d) for d in data]
                    
                    allKpis.append(k)
                    dataAllKpis.append(data)
                    coloursAllKpis.append(palettes[i][j])
            
            # flatten data        
            dataAllKpis = [item for sublist in dataAllKpis for item in sublist]
            exportDict = {
                'graphID':{
                    'plot':plot,
                    'option':option.title(),
                },    
                    'graphValues':{
                        'allKpis':allKpis,
                        'coloursAllKpis':coloursAllKpis,
                        'dataAllKpis':dataAllKpis
                                    }
                    }
   
        return exportDict
        
    else:
        print('there is no values with this combination')            
