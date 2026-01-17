import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { AlertTriangle, AlertCircle, Bell, Clock, MapPin, Camera } from 'lucide-react';
import type { Alert } from '@/app/data/mockData';
import { generateAlerts } from '@/app/data/mockData';

export function AlertsPanel() {
    const [alerts, setAlerts] = useState<Alert[]>(generateAlerts());
    const [filter, setFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');

    // Simulate real-time alert updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly add a new alert
            if (Math.random() > 0.7) {
                const newAlerts = generateAlerts();
                setAlerts(prev => [newAlerts[0], ...prev].slice(0, 20));
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const filteredAlerts = filter === 'all'
        ? alerts
        : alerts.filter(alert => alert.severity === filter);

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'High':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            case 'Medium':
                return <AlertTriangle className="w-5 h-5 text-orange-600" />;
            case 'Low':
                return <Bell className="w-5 h-5 text-yellow-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'High': return 'bg-red-50 border-red-200';
            case 'Medium': return 'bg-orange-50 border-orange-200';
            case 'Low': return 'bg-yellow-50 border-yellow-200';
            default: return 'bg-gray-50 border-gray-200';
        }
    };

    const getSeverityBadgeVariant = (severity: string): "default" | "destructive" | "secondary" => {
        switch (severity) {
            case 'High': return 'destructive';
            case 'Medium': return 'default';
            default: return 'secondary';
        }
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return date.toLocaleDateString();
    };

    const alertCounts = {
        all: alerts.length,
        High: alerts.filter(a => a.severity === 'High').length,
        Medium: alerts.filter(a => a.severity === 'Medium').length,
        Low: alerts.filter(a => a.severity === 'Low').length
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Real-Time Alerts</h1>
                <p className="text-gray-600 mt-1">Live safety violation alerts from all zones</p>
            </div>

            {/* Alert Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card
                    className={`cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Total Alerts</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{alertCounts.all}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={`cursor-pointer transition-all ${filter === 'High' ? 'ring-2 ring-red-500' : ''}`}
                    onClick={() => setFilter('High')}
                >
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">High Severity</p>
                            <p className="text-3xl font-bold text-red-600 mt-1">{alertCounts.High}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={`cursor-pointer transition-all ${filter === 'Medium' ? 'ring-2 ring-orange-500' : ''}`}
                    onClick={() => setFilter('Medium')}
                >
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Medium Severity</p>
                            <p className="text-3xl font-bold text-orange-600 mt-1">{alertCounts.Medium}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={`cursor-pointer transition-all ${filter === 'Low' ? 'ring-2 ring-yellow-500' : ''}`}
                    onClick={() => setFilter('Low')}
                >
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Low Severity</p>
                            <p className="text-3xl font-bold text-yellow-600 mt-1">{alertCounts.Low}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Alert Timeline</CardTitle>
                        <Badge variant="outline" className="text-xs">
                            Auto-updating every 5s
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 max-h-150 overflow-y-auto">
                        {filteredAlerts.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No alerts found for this filter
                            </div>
                        ) : (
                            filteredAlerts.map(alert => (
                                <div
                                    key={alert.id}
                                    className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)} transition-all hover:shadow-md`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">
                                            {getSeverityIcon(alert.severity)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{alert.violationType}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                                                </div>
                                                <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                                                    {alert.severity}
                                                </Badge>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{formatTimestamp(alert.timestamp)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Camera className="w-3 h-3" />
                                                    <span>{alert.cameraId}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{alert.zone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
