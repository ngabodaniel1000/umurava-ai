'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
    { day: 'Mon', screenings: 4 },
    { day: 'Tue', screenings: 7 },
    { day: 'Wed', screenings: 5 },
    { day: 'Thu', screenings: 12 },
    { day: 'Fri', screenings: 8 },
    { day: 'Sat', screenings: 3 },
    { day: 'Sun', screenings: 6 },
];

const chartConfig = {
    screenings: {
        label: 'Screenings',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

export function ActivityChart() {
    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
                data={chartData}
                margin={{
                    left: -20,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                    <linearGradient id="fillScreenings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-screenings)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-screenings)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="screenings"
                    type="natural"
                    fill="url(#fillScreenings)"
                    fillOpacity={0.4}
                    stroke="var(--color-screenings)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    );
}
