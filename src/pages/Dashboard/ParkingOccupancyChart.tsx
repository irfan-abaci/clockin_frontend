import React from 'react';
import { ApexOptions } from 'apexcharts';
import Card, {
    CardBody,
    CardHeader,
    CardLabel,
    CardTitle,
} from '../../components/bootstrap/Card';
import Chart from '../../components/extras/Chart';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';

const ParkingOccupancyChart = ({ colors, title, graphData, isLoading }: any) => {

    const chartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            height: 300,
            // events: {
            //     dataPointSelection: (event, chartContext, config) => {
            //         const { dataPointIndex, seriesIndex, w } = config;
            //         const label = w.config.labels?.[dataPointIndex];
            //         const value = w.config.series?.[dataPointIndex];
            //         console.log('Clicked on:', label, value);
            //         // navigate('/vehicles')
            //         // You can trigger any function or set state here
            //     },
            // },
        },
        stroke: {
            width: 0,
        },
        labels: ['Occupied', 'Vacant'],
        colors: colors,

        plotOptions: {
            pie: {
                expandOnClick: true,
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '16px',
                            fontWeight: 900,
                            offsetY: 0,
                            formatter(val) {
                                return val;
                            },
                        },
                        value: {
                            show: true,
                            fontSize: '20px',
                            fontWeight: 900,
                            offsetY: 16,
                            formatter(val) {
                                return val; // Ensure it returns the raw value
                            },
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Vacant',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#373d3f',
                            formatter(w) {
                                const secondItem = w.globals.seriesTotals[1] ?? 0; // Get the second item
                                return secondItem.toString();
                            },
                        },
                    },
                },
            },
        },
        dataLabels: {
            enabled: false, // Ensure data labels are enabled

        },
        legend: {
            show: true,
            position: 'right',
        },

    };

    return (
        <Card stretch >
            <CardHeader>
                <CardLabel>
                    <CardTitle tag='div' className='h3'>
                        {title}
                    </CardTitle>
                </CardLabel>
            </CardHeader>
            <CardBody>
                {isLoading ? <CustomSpinner /> :
                    <Chart
                        series={graphData}
                        options={chartOptions}
                        type={chartOptions.chart?.type}
                        height={chartOptions.chart?.height}
                    />}
            </CardBody>
        </Card>
    );
};

export default ParkingOccupancyChart;