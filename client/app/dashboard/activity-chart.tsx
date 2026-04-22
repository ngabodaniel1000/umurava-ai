'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
    screenings: {
        label: 'Screenings',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

export function ActivityChart({ data }: { data?: any[] }) {
    const displayData = data && data.length > 0 ? data : [
        { day: 'Mon', screenings: 0 },
        { day: 'Tue', screenings: 0 },
        { day: 'Wed', screenings: 0 },
        { day: 'Thu', screenings: 0 },
        { day: 'Fri', screenings: 0 },
        { day: 'Sat', screenings: 0 },
        { day: 'Sun', screenings: 0 },
    ];

    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
                data={displayData}
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
