'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
    { range: '0-2', count: 12 },
    { range: '2-4', count: 25 },
    { range: '4-6', count: 48 },
    { range: '6-8', count: 95 },
    { range: '8-10', count: 68 },
];

const chartConfig = {
    count: {
        label: 'Candidates',
        color: 'var(--chart-5)',
    },
} satisfies ChartConfig;

export function ScoreChart() {
    return (
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                    dataKey="range"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar
                    dataKey="count"
                    fill="var(--color-count)"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                />
            </BarChart>
        </ChartContainer>
    );
}
