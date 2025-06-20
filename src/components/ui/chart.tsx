import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export type ApexOptions = {
  chart?: {
    type?:
      | 'bar'
      | 'donut'
      | 'line'
      | 'area'
      | 'pie'
      | 'radialBar'
      | 'scatter'
      | 'bubble'
      | 'heatmap'
      | 'candlestick'
      | 'boxPlot'
      | 'radar'
      | 'polarArea'
      | 'rangeBar'
      | 'rangeArea'
      | 'treemap';
    height?: number;
    width?: number | string;
    toolbar?: {
      show?: boolean;
    };
    background?: string;
    fontFamily?: string;
  };
  colors?: string[];
  labels?: string[];
  xaxis?: {
    categories?: string[];
    labels?: {
      style?: {
        colors?: string | string[];
        fontSize?: string;
        fontFamily?: string;
      };
      rotate?: number;
      trim?: boolean;
    };
    axisBorder?: {
      show?: boolean;
      color?: string;
    };
    axisTicks?: {
      show?: boolean;
      color?: string;
    };
  };
  yaxis?: {
    labels?: {
      style?: {
        colors?: string | string[];
        fontSize?: string;
        fontFamily?: string;
      };
      formatter?: (val: number) => string;
    };
    min?: number;
    max?: number;
    tickAmount?: number;
  };
  dataLabels?: {
    enabled?: boolean;
    style?: {
      fontSize?: string;
      colors?: string[];
    };
  };
  stroke?: {
    curve?: string;
    width?: number;
    colors?: string[];
  };
  grid?: {
    borderColor?: string;
    strokeDashArray?: number;
    padding?: {
      left?: number;
      right?: number;
      top?: number;
      bottom?: number;
    };
    yaxis?: {
      lines?: {
        show?: boolean;
      };
    };
    xaxis?: {
      lines?: {
        show?: boolean;
      };
    };
    row?: {
      colors?: string[];
      opacity?: number;
    };
  };
  fill?: {
    opacity?: number;
    type?: string;
    gradient?: {
      shade?: string;
      type?: string;
      shadeIntensity?: number;
      gradientToColors?: string[];
      inverseColors?: boolean;
      opacityFrom?: number;
      opacityTo?: number;
      stops?: number[];
    };
  };
  tooltip?: {
    theme?: string;
    style?: {
      fontSize?: string;
      fontFamily?: string;
    };
    y?: {
      formatter?: (val: number) => string;
    };
    marker?: {
      show?: boolean;
    };
  };
  responsive?: Array<{
    breakpoint: number;
    options: Record<string, unknown>;
  }>;
  plotOptions?: {
    bar?: {
      borderRadius?: number;
      columnWidth?: string;
      horizontal?: boolean;
      distributed?: boolean;
      dataLabels?: {
        position?: string;
      };
    };
    pie?: {
      donut?: {
        size?: string;
        background?: string;
        labels?: {
          show?: boolean;
          name?: {
            show?: boolean;
            fontSize?: string;
            color?: string;
            fontFamily?: string;
          };
          value?: {
            show?: boolean;
            fontSize?: string;
            color?: string;
            fontFamily?: string;
            formatter?: (val: number) => string;
          };
          total?: {
            show?: boolean;
            label?: string;
            color?: string;
            formatter?: (w: Record<string, unknown>) => string;
          };
        };
      };
      expandOnClick?: boolean;
    };
  };
  legend?: {
    show?: boolean;
    position?: string;
    horizontalAlign?: string;
    fontSize?: string;
    fontFamily?: string;
    offsetX?: number;
    offsetY?: number;
    labels?: {
      colors?: string | string[];
      useSeriesColors?: boolean;
    };
    markers?: {
      size?: number;
      strokeWidth?: number;
      strokeColor?: string;
      fillColors?: string[];
      radius?: number;
      offsetX?: number;
      offsetY?: number;
    };
    itemMargin?: {
      horizontal?: number;
      vertical?: number;
    };
    onItemClick?: {
      toggleDataSeries?: boolean;
    };
    formatter?: (legendName: string, opts?: Record<string, unknown>) => string;
  };
  theme?: {
    mode?: string;
    palette?: string;
  };
  states?: {
    hover?: {
      filter?: {
        type?: string;
        value?: number;
      };
    };
    active?: {
      filter?: {
        type?: string;
        value?: number;
      };
    };
  };
};

export const BarChart = ({
  data,
  height = 300,
  colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'],
  formatter = (value: number) => `${value}`,
  title = '',
}: {
  data: Array<{ label: string; value: number }>;
  height?: number;
  colors?: string[];
  formatter?: (value: number) => string;
  title?: string;
}) => {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height,
      width: '100%',
      toolbar: {
        show: false,
      },
      background: 'transparent',
      fontFamily: 'inherit',
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '65%',
        distributed: true,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: '12px',
        colors: ['#f8fafc'],
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories: data.map(item => item.label),
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '12px',
          fontFamily: 'inherit',
        },
        rotate: -45,
        trim: true,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '12px',
          fontFamily: 'inherit',
        },
        formatter: val => {
          if (val === Math.floor(val)) {
            return val.toString();
          }
          return '';
        },
      },
      min: 0,
      tickAmount: 4,
    },
    grid: {
      borderColor: '#334155',
      strokeDashArray: 4,
      padding: {
        left: 10,
        right: 10,
        top: 0,
        bottom: 0,
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      opacity: 1,
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.4,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.6,
        stops: [0, 90, 100],
      },
    },
    colors,
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
      },
      y: {
        formatter,
      },
      marker: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '70%',
              borderRadius: 4,
            },
          },
          xaxis: {
            labels: {
              rotate: -45,
              style: {
                fontSize: '10px',
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '10px',
              },
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
          },
          plotOptions: {
            bar: {
              columnWidth: '85%',
              borderRadius: 3,
            },
          },
          xaxis: {
            labels: {
              rotate: -45,
              style: {
                fontSize: '9px',
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '9px',
              },
            },
          },
        },
      },
    ],
  };

  const series = [
    {
      name: title,
      data: data.map(item => item.value),
    },
  ];

  return (
    <div className="h-full w-full overflow-hidden">
      {typeof window !== 'undefined' && (
        <ReactApexChart
          options={options as ApexCharts.ApexOptions}
          series={series}
          type="bar"
          height={height}
          width="100%"
        />
      )}
    </div>
  );
};

export const PieChart = ({
  data,
  height = 300,
  colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'],
  formatter = (value: number) => `${value}`,
}: {
  data: Array<{ label: string; value: number }>;
  height?: number;
  colors?: string[];
  formatter?: (value: number) => string;
}) => {
  const options: ApexOptions = {
    chart: {
      type: 'pie',
      height,
      toolbar: {
        show: false,
      },
      background: 'transparent',
      fontFamily: 'inherit',
    },
    labels: data.map(item => item.label),
    colors,
    stroke: {
      width: 2,
      colors: ['#1e293b'],
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      fontFamily: 'inherit',
      offsetY: 5,
      labels: {
        colors: '#94a3b8',
      },
      markers: {
        size: 8,
        strokeWidth: 0,
        strokeColor: '#1e293b',
        radius: 6,
        offsetX: -2,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 3,
      },
      onItemClick: {
        toggleDataSeries: false,
      },
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
      },
      y: {
        formatter,
      },
    },
    dataLabels: {
      enabled: false,
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.9,
        },
      },
      active: {
        filter: {
          type: 'darken',
          value: 0.6,
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 280,
          },
          legend: {
            fontSize: '11px',
            offsetY: 0,
            itemMargin: {
              horizontal: 8,
              vertical: 2,
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
          },
          legend: {
            fontSize: '10px',
            offsetY: -5,
            itemMargin: {
              horizontal: 6,
              vertical: 1,
            },
            markers: {
              size: 6,
            },
          },
        },
      },
    ],
  };

  const series = data.map(item => item.value);

  return (
    <div className="h-full w-full overflow-hidden">
      {typeof window !== 'undefined' && (
        <ReactApexChart
          options={options as ApexCharts.ApexOptions}
          series={series}
          type="pie"
          height={height}
          width="100%"
        />
      )}
    </div>
  );
};

export { ReactApexChart };
