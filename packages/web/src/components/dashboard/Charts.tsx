'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface VolumeChartProps {
    data: { hour: string; volume: number; count: number }[];
}

export function VolumeChart({ data }: VolumeChartProps) {
    return (
        <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                24h Volume
            </h2>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="hour"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 11 }}
                            interval={3}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 11 }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            width={50}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(30, 30, 58, 0.95)',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            }}
                            labelStyle={{ color: '#a1a1aa' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
                        />
                        <Area
                            type="monotone"
                            dataKey="volume"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            fill="url(#volumeGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

interface ProtocolPieChartProps {
    data: { name: string; volume: string }[];
}

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444'];

export function ProtocolPieChart({ data }: ProtocolPieChartProps) {
    const chartData = data.slice(0, 5).map(p => ({
        name: p.name,
        value: parseFloat(p.volume),
    }));

    return (
        <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Protocol Distribution
            </h2>
            <div className="h-[250px] flex items-center">
                <div className="w-1/2">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-2">
                    {chartData.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ background: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm text-[var(--text-secondary)] flex-1 truncate">
                                {item.name}
                            </span>
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                                ${(item.value / 1000).toFixed(1)}k
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
