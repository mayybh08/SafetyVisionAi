import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { violationsOverTime, complianceByZone, violationTypes } from '@/app/data/mockData';

export function Analytics() {
    // Colors for charts
    const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

    // Calculate trends
    const violationTrend = violationsOverTime[violationsOverTime.length - 1].violations <
        violationsOverTime[violationsOverTime.length - 2].violations ? 'down' : 'up';

    const trendPercentage = Math.abs(
        ((violationsOverTime[violationsOverTime.length - 1].violations -
            violationsOverTime[violationsOverTime.length - 2].violations) /
            violationsOverTime[violationsOverTime.length - 2].violations) * 100
    ).toFixed(1);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-600 mt-1">Comprehensive safety analytics and performance metrics</p>
            </div>

            {/* Violations Over Time */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Safety Violations Over Time</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">Last 7 days trend analysis</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {violationTrend === 'down' ? (
                                <>
                                    <TrendingDown className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-medium text-green-600">
                                        -{trendPercentage}% from yesterday
                                    </span>
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="w-5 h-5 text-red-600" />
                                    <span className="text-sm font-medium text-red-600">
                                        +{trendPercentage}% from yesterday
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={violationsOverTime}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                stroke="#6b7280"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value: number) => {
                                    const date = new Date(value);
                                    return `${date.getMonth() + 1}/${date.getDate()}`;
                                }}
                            />
                            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                                labelFormatter={(value: string) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString();
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="violations"
                                stroke="#ef4444"
                                strokeWidth={3}
                                dot={{ fill: '#ef4444', r: 5 }}
                                activeDot={{ r: 7 }}
                                name="Violations"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* PPE Compliance & Violation Types Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PPE Compliance by Zone */}
                <Card>
                    <CardHeader>
                        <CardTitle>PPE Compliance by Zone</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">Current compliance rates across all areas</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={complianceByZone}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="zone"
                                    stroke="#6b7280"
                                    tick={{ fontSize: 11 }}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    tick={{ fontSize: 12 }}
                                    domain={[0, 100]}
                                    tickFormatter={(value: number) => `${value}%`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value?: number) => `${value ?? 0}%`}
                                />
                                <Legend />
                                <Bar
                                    dataKey="compliance"
                                    fill="#22c55e"
                                    radius={[8, 8, 0, 0]}
                                    name="Compliance Rate (%)"
                                />
                            </BarChart>
                        </ResponsiveContainer>

                        {/* Compliance Summary */}
                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">
                                    Average Compliance: {Math.round(complianceByZone.reduce((sum: number, zone: { compliance: number }) => sum + zone.compliance, 0) / complianceByZone.length)}%
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Violation Types Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Violation Types Distribution</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">Breakdown of safety violations by type</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    data={violationTypes as any}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {violationTypes.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Legend */}
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {violationTypes.map((type, index) => (
                                <div key={type.name} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-xs text-gray-600">{type.name}: {type.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Key Insights */}
            <Card>
                <CardHeader>
                    <CardTitle>Key Insights & Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <h4 className="font-semibold text-red-900 mb-2">Critical Finding</h4>
                            <p className="text-sm text-red-700">
                                Welding Zone B shows the lowest compliance at 78%. Immediate training and monitoring recommended.
                            </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-900 mb-2">Positive Trend</h4>
                            <p className="text-sm text-blue-700">
                                Overall violations decreased by {trendPercentage}% in the last 24 hours, showing improvement in safety awareness.
                            </p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <h4 className="font-semibold text-orange-900 mb-2">Top Violation</h4>
                            <p className="text-sm text-orange-700">
                                "No Helmet" accounts for 35% of all violations. Consider additional helmet availability and signage.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
