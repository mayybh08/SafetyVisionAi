import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { MapPin, Users, AlertTriangle } from 'lucide-react';
import { zoneRiskData } from '@/app/data/mockData';
import type { ZoneRisk } from '@/app/data/mockData';

export function ZoneHeatmap() {
    const getRiskColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'safe': return 'bg-green-500';
            case 'moderate': return 'bg-yellow-500';
            case 'high': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getRiskBorderColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'safe': return 'border-green-500';
            case 'moderate': return 'border-yellow-500';
            case 'high': return 'border-red-500';
            default: return 'border-gray-500';
        }
    };

    const getRiskBgColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'safe': return 'bg-green-50';
            case 'moderate': return 'bg-yellow-50';
            case 'high': return 'bg-red-50';
            default: return 'bg-gray-50';
        }
    };

    const getRiskBadgeVariant = (riskLevel: string): "default" | "destructive" | "secondary" => {
        switch (riskLevel) {
            case 'high': return 'destructive';
            case 'moderate': return 'default';
            default: return 'secondary';
        }
    };

    const safeZones = zoneRiskData.filter(z => z.riskLevel === 'safe').length;
    const moderateZones = zoneRiskData.filter(z => z.riskLevel === 'moderate').length;
    const highRiskZones = zoneRiskData.filter(z => z.riskLevel === 'high').length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Zone-Based Risk Heatmap</h1>
                <p className="text-gray-600 mt-1">Real-time risk assessment across factory zones</p>
            </div>

            {/* Risk Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Safe Zones</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{safeZones}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <div className="w-6 h-6 bg-green-500 rounded-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Moderate Risk Zones</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-1">{moderateZones}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <div className="w-6 h-6 bg-yellow-500 rounded-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">High Risk Zones</p>
                                <p className="text-3xl font-bold text-red-600 mt-1">{highRiskZones}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <div className="w-6 h-6 bg-red-500 rounded-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Heatmap Visualization */}
            <Card>
                <CardHeader>
                    <CardTitle>Factory Floor Heatmap</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Interactive zone risk visualization</p>
                </CardHeader>
                <CardContent>
                    {/* Heatmap Grid */}
                    <div className="relative w-full aspect-16/10 bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden">
                        {/* Grid background */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
                `,
                                backgroundSize: '40px 40px'
                            }}
                        />

                        {/* Factory outline */}
                        <div className="absolute inset-4 border-4 border-gray-400 rounded-lg bg-white/50">
                            <div className="absolute top-2 left-2 text-xs text-gray-500 font-semibold">
                                Factory Floor Layout
                            </div>
                        </div>

                        {/* Zone markers */}
                        {zoneRiskData.map((zone) => (
                            <ZoneMarker key={zone.id} zone={zone} />
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full" />
                            <span className="text-sm text-gray-600">Safe Zone</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                            <span className="text-sm text-gray-600">Moderate Risk</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded-full" />
                            <span className="text-sm text-gray-600">High Risk</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Zone Details Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Zone Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {zoneRiskData.map((zone) => (
                            <div
                                key={zone.id}
                                className={`p-4 rounded-lg border-2 ${getRiskBorderColor(zone.riskLevel)} ${getRiskBgColor(zone.riskLevel)}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-600" />
                                        <h4 className="font-semibold text-gray-900">{zone.name}</h4>
                                    </div>
                                    <Badge variant={getRiskBadgeVariant(zone.riskLevel)}>
                                        {zone.riskLevel.toUpperCase()}
                                    </Badge>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Risk Level:</span>
                                        <div className="flex items-center gap-1">
                                            <div className={`w-3 h-3 ${getRiskColor(zone.riskLevel)} rounded-full`} />
                                            <span className="capitalize font-medium">{zone.riskLevel}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Active Workers:</span>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3 text-gray-600" />
                                            <span className="font-medium">{zone.workersCount}</span>
                                        </div>
                                    </div>
                                </div>

                                {zone.riskLevel === 'high' && (
                                    <div className="mt-3 pt-3 border-t border-red-200">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                            <p className="text-xs text-red-700">
                                                Immediate attention required. High violation rate detected.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Contextual Risk Analysis Info */}
            <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-purple-900">Contextual Risk Analysis</h4>
                            <p className="text-sm text-purple-700 mt-1">
                                The heatmap is generated using contextual risk analysis that combines multiple factors including:
                                real-time PPE compliance rates, historical violation data, worker density, hazardous equipment presence,
                                and environmental conditions. The AI system continuously updates risk levels every 30 seconds using
                                BotSORT tracking and YOLOv8 object detection to ensure accurate zone classification.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function ZoneMarker({ zone }: { zone: ZoneRisk }) {
    const getRiskColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'safe': return 'bg-green-500';
            case 'moderate': return 'bg-yellow-500';
            case 'high': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getPulseColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'safe': return 'bg-green-400';
            case 'moderate': return 'bg-yellow-400';
            case 'high': return 'bg-red-400';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div
            className="absolute group cursor-pointer"
            style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                transform: 'translate(-50%, -50%)'
            }}
        >
            {/* Pulsing circle for high risk */}
            {zone.riskLevel === 'high' && (
                <div className={`absolute inset-0 w-20 h-20 ${getPulseColor(zone.riskLevel)} rounded-full opacity-40 animate-ping`}
                    style={{ animationDuration: '2s' }}
                />
            )}

            {/* Main zone marker */}
            <div className={`relative w-20 h-20 ${getRiskColor(zone.riskLevel)} rounded-full opacity-70 group-hover:opacity-90 transition-opacity flex items-center justify-center shadow-lg`}>
                <div className="text-white text-center">
                    <MapPin className="w-6 h-6 mx-auto mb-1" />
                    <div className="text-xs font-semibold">{zone.workersCount}</div>
                </div>
            </div>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                    <div className="font-semibold">{zone.name}</div>
                    <div className="text-gray-300 mt-1">
                        Risk: <span className="capitalize">{zone.riskLevel}</span>
                    </div>
                    <div className="text-gray-300">
                        Workers: {zone.workersCount}
                    </div>
                </div>
                <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
            </div>
        </div>
    );
}
