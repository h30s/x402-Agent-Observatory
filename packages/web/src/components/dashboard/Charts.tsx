'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface VolumeChartProps {
    data: { hour: string; volume: number; count: number }[];
}

export function VolumeChart({ data }: VolumeChartProps) {
    return (
        <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="hour"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        interval={3}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        width={50}
                    />
                    <Tooltip
                        contentStyle={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            color: '#0f172a'
                        }}
                        labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                        itemStyle={{ color: '#0f172a', fontWeight: 600, fontSize: '13px' }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="volume"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        fill="url(#volumeGradient)"
                        activeDot={{ r: 4, strokeWidth: 0, fill: '#4f46e5' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

interface ProtocolPieChartProps {
    data: { name: string; volume: string }[];
}

// Professional Palette: Indigo, Sky, Emerald, Amber, Slate
const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#64748b'];

export function ProtocolPieChart({ data }: ProtocolPieChartProps) {
    const chartData = data.slice(0, 5).map(p => ({
        name: p.name,
        value: parseFloat(p.volume),
    }));

    return (
        <div className="h-full w-full flex items-center">
            <div className="w-1/2 relative" style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                            itemStyle={{ color: '#0f172a', fontWeight: 600, fontSize: '13px' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <div className="text-xs text-[var(--text-muted)]">Total</div>
                        <div className="text-sm font-bold text-[var(--text-primary)]">100%</div>
                    </div>
                </div>
            </div>
            <div className="w-1/2 space-y-3 pl-4">
                {chartData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-3">
                        <div
                            className="w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm"
                            style={{ background: COLORS[index % COLORS.length] }}
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm font-medium text-[var(--text-primary)] truncate block max-w-[100px]" title={item.name}>
                                    {item.name}
                                </span>
                                <span className="text-xs text-[var(--text-muted)]">
                                    ${(item.value / 1000).toFixed(0)}k
                                </span>
                            </div>
                            {/* Simple progress bar representation */}
                            <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                                <div
                                    className="h-1 rounded-full"
                                    style={{
                                        width: `${(item.value / chartData.reduce((a, b) => a + b.value, 0)) * 100}%`,
                                        background: COLORS[index % COLORS.length]
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
