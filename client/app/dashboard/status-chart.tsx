'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import * as React from 'react';

const chartConfig = {
    count: {
        label: 'Candidates',
    },
    passed: {
        label: 'Passed',
        color: '#22c55e',
    },
    review: {
        label: 'Review',
        color: '#3b82f6',
    },
} satisfies ChartConfig;

export function StatusChart({ data }: { data?: any[] }) {
    // Check if we actually have any candidates to show
    const totalCount = data?.reduce((acc, curr) => acc + (curr.count || 0), 0) || 0;

    // Default structure if no data provided
    const displayData = data && data.length > 0 ? data : [
        { status: 'passed', count: 0 },
        { status: 'review', count: 0 },
    ];

    // Map status names for display
    const chartData = displayData.map(item => ({
        ...item,
        statusLabel: item.status === 'passed' ? 'Shortlisted' : 'Pending Review'
    }));

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] w-full"
        >
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                    dataKey="statusLabel"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                >
                    {chartData.map((entry, index) => {
                        const color = (chartConfig[entry.status as keyof typeof chartConfig] as any)?.color || 'var(--chart-1)';
                        return <Bar key={`cell-${index}`} dataKey="count" fill={color} />;
                    })}
                </Bar>
            </BarChart>
        </ChartContainer>
    );
}
