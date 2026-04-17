'use client';

import { Label, Pie, PieChart } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import * as React from 'react';

const chartData = [
    { status: 'passed', count: 145, fill: 'var(--color-passed)' },
    { status: 'review', count: 68, fill: 'var(--color-review)' },
    { status: 'rejected', count: 35, fill: 'var(--color-rejected)' },
];

const chartConfig = {
    count: {
        label: 'Candidates',
    },
    passed: {
        label: 'Passed',
        color: 'var(--chart-2)',
    },
    review: {
        label: 'Review',
        color: 'var(--chart-3)',
    },
    rejected: {
        label: 'Rejected',
        color: 'var(--chart-4)',
    },
} satisfies ChartConfig;

export function StatusChart() {
    const totalCandidates = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.count, 0);
    }, []);

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
        >
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={60}
                    strokeWidth={5}
                >
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-bold"
                                        >
                                            {totalCandidates.toLocaleString()}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Candidates
                                        </tspan>
                                    </text>
                                );
                            }
                        }}
                    />
                </Pie>
            </PieChart>
        </ChartContainer>
    );
}
