// use apex chart
import React from 'react';
import dynamic from 'next/dynamic';

// Import ApexCharts secara dinamis untuk menghindari masalah SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Tipe data untuk opsi chart
export type ApexOptions = {
  chart?: {
    type?: 'bar' | 'donut' | 'line' | 'area' | 'pie' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap';
    height?: number;
    width?: number;
    toolbar?: {
      show?: boolean;
    };
    background?: string;
  };
  colors?: string[];
  labels?: string[];
  xaxis?: {
    categories?: string[];
    labels?: {
      style?: {
        colors?: string | string[];
      };
    };
    axisBorder?: {
      show?: boolean;
    };
    axisTicks?: {
      show?: boolean;
    };
  };
  yaxis?: {
    labels?: {
      style?: {
        colors?: string | string[];
      };
    };
  };
  dataLabels?: {
    enabled?: boolean;
  };
  stroke?: {
    curve?: string;
    width?: number;
  };
  grid?: {
    borderColor?: string;
    strokeDashArray?: number;
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
    y?: {
      formatter?: (val: number) => string;
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
    };
    pie?: {
      donut?: {
        size?: string;
        labels?: {
          show?: boolean;
          name?: {
            show?: boolean;
            fontSize?: string;
            color?: string;
          };
          value?: {
            show?: boolean;
            fontSize?: string;
            color?: string;
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
    position?: string;
    horizontalAlign?: string;
    fontSize?: string;
    labels?: {
      colors?: string | string[];
    };
    markers?: {
      size?: number;
      strokeWidth?: number;
      fillColors?: string[];
      radius?: number;
      offsetX?: number;
      offsetY?: number;
    };
    itemMargin?: {
      horizontal?: number;
      vertical?: number;
    };
  };
};

// Komponen Bar Chart
export const BarChart = ({ 
  data, 
  height = 300,
  colors = ['#3b82f6'],
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
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories: data.map(item => item.label),
      labels: {
        style: {
          colors: '#9ca3af',
        },
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
          colors: '#9ca3af',
        },
      },
    },
    grid: {
      borderColor: '#27272a',
      strokeDashArray: 4,
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
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.8,
        opacityTo: 0.5,
        stops: [0, 100],
      },
    },
    colors,
    tooltip: {
      theme: 'dark',
      y: {
        formatter,
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '80%',
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
    <div className="h-full w-full">
      {typeof window !== 'undefined' && (
        <ReactApexChart
          options={options as ApexCharts.ApexOptions}
          series={series}
          type="bar"
          height={height}
        />
      )}
    </div>
  );
};

// Komponen Donut Chart
export const DonutChart = ({
  data,
  height = 300,
  colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'],
  formatter = (value: number) => `${value}`,
}: {
  data: Array<{ label: string; value: number }>;
  height?: number;
  colors?: string[];
  formatter?: (value: number) => string;
}) => {
  const options: ApexOptions = {
    chart: {
      type: 'donut',
      height,
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    labels: data.map(item => item.label),
    colors,
    stroke: {
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              color: '#9ca3af',
            },
            value: {
              show: true,
              fontSize: '20px',
              color: '#9ca3af',
              formatter: (val) => formatter(val),
            },
            total: {
              show: true,
              label: 'Total',
              color: '#9ca3af',
              formatter: function (w) {
                const total = (w as unknown as { globals: { seriesTotals: number[] } }).globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return formatter(total);
              }
            }
          }
        },
        expandOnClick: false,
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      labels: {
        colors: '#9ca3af',
      },
      markers: {
        size: 12,
        radius: 12,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 5,
      },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter,
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 280,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const series = data.map(item => item.value);

  return (
    <div className="h-full w-full">
      {typeof window !== 'undefined' && (
        <ReactApexChart
          options={options as ApexCharts.ApexOptions}
          series={series}
          type="donut"
          height={height}
        />
      )}
    </div>
  );
};

export { ReactApexChart };



