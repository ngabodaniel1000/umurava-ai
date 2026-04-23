'use client';

import { Cell, Label, Pie, PieChart } from 'recharts';
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
        color: 'var(--chart-2)',
    },
    review: {
        label: 'Review',
        color: 'var(--chart-3)',
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

    const totalCandidates = React.useMemo(() => {
        return displayData.reduce((acc, curr) => acc + curr.count, 0);
    }, [displayData]);

    // Handle the case where all counts are 0 - provide a placeholder "grey" slice
    const chartData = totalCandidates > 0 ? displayData : [{ status: 'none', count: 1, isPlaceholder: true }];

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] w-full"
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
                    {chartData.map((entry, index) => {
                        // Use color from config based on status key
                        const color = entry.isPlaceholder
                            ? 'rgba(156, 163, 175, 0.2)' // Grey for empty state
                            : (chartConfig[entry.status as keyof typeof chartConfig] as any)?.color || 'var(--chart-1)';

                        return <Cell key={`cell-${index}`} fill={color} />;
                    })}
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
