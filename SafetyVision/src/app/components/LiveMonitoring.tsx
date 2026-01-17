import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Video, Circle, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { mockCameraFeeds } from '@/app/data/mockData';
import type { Detection } from '@/app/data/mockData';

export function LiveMonitoring() {
    const [selectedCamera, setSelectedCamera] = useState(mockCameraFeeds[0]);
    const [detections, setDetections] = useState<Detection[]>(selectedCamera.detections);
    const [stats, setStats] = useState({
        totalDetections: 0,
        safeCount: 0,
        warningCount: 0,
        criticalCount: 0
    });

    // Simulate real-time detection updates
    useEffect(() => {
        const interval = setInterval(() => {
            setDetections(prevDetections =>
                prevDetections.map(detection => ({
                    ...detection,
                    // Slightly randomize bounding box positions for animation effect
                    bbox: {
                        ...detection.bbox,
                        x: detection.bbox.x + (Math.random() - 0.5) * 3,
                        y: detection.bbox.y + (Math.random() - 0.5) * 3
                    },
                    // Slightly vary confidence
                    confidence: Math.min(0.99, Math.max(0.65, detection.confidence + (Math.random() - 0.5) * 0.05))
                }))
            );
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // Update stats when detections change
    useEffect(() => {
        const safeCount = detections.filter(d => d.status === 'safe').length;
        const warningCount = detections.filter(d => d.status === 'warning').length;
        const criticalCount = detections.filter(d => d.status === 'critical').length;

        setTimeout(() => {
            setStats({
                totalDetections: detections.length,
                safeCount,
                warningCount,
                criticalCount
            });
        }, 0);
    }, [detections]);

    // Handle camera change
    const handleCameraChange = (cameraId: string) => {
        const camera = mockCameraFeeds.find(cam => cam.id === cameraId);
        if (camera) {
            setSelectedCamera(camera);
            setDetections(camera.detections);
        }
    };


    const feedStatus = detections.some(d => d.status === 'critical')
        ? 'critical'
        : detections.some(d => d.status === 'warning')
            ? 'warning'
            : 'safe';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Live Camera Monitoring</h1>
                    <p className="text-gray-600 mt-1">Real-time CCTV feed with AI-powered PPE detection</p>
                </div>

                {/* Camera Selector */}
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Select Camera:</label>
                    <Select value={selectedCamera.id} onValueChange={handleCameraChange}>
                        <SelectTrigger className="w-64">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {mockCameraFeeds.map(camera => (
                                <SelectItem key={camera.id} value={camera.id}>
                                    {camera.name} ({camera.id})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-xs text-gray-600">Total Detections</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.totalDetections}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-xs text-gray-600">Safe</p>
                            <p className="text-3xl font-bold text-green-600">{stats.safeCount}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-xs text-gray-600">Warnings</p>
                            <p className="text-3xl font-bold text-yellow-600">{stats.warningCount}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-xs text-gray-600">Critical</p>
                            <p className="text-3xl font-bold text-red-600">{stats.criticalCount}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Camera Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Large Video Feed */}
                <div className="lg:col-span-2">
                    <Card className={`border-2 ${feedStatus === 'critical' ? 'border-red-500' :
                        feedStatus === 'warning' ? 'border-yellow-500' :
                            'border-green-500'
                        }`}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Video className="w-5 h-5 text-gray-600" />
                                    <div>
                                        <CardTitle className="text-lg">{selectedCamera.name}</CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {selectedCamera.id} • {selectedCamera.zone}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant={
                                            feedStatus === 'safe' ? 'default' :
                                                feedStatus === 'warning' ? 'secondary' :
                                                    'destructive'
                                        }
                                    >
                                        {feedStatus.toUpperCase()}
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                        <Circle className="w-3 h-3 fill-red-500 text-red-500 animate-pulse" />
                                        <span className="text-sm font-medium text-red-600">LIVE</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
                                {/* Video as background */}
                                <video
                                    src="/video/input.mp4"
                                    className="absolute inset-0 w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    muted
                                    style={{ zIndex: 1 }}
                                />

                                {/* Timestamp overlay */}
                                <div className="absolute top-4 left-4 bg-black/80 px-3 py-2 rounded-lg backdrop-blur-sm z-10">
                                    <p className="text-white text-sm font-mono">
                                        {new Date().toLocaleTimeString()} • LIVE
                                    </p>
                                </div>

                                {/* Camera Info */}
                                <div className="absolute top-4 right-4 bg-black/80 px-3 py-2 rounded-lg backdrop-blur-sm z-10">
                                    <p className="text-white text-xs font-mono">
                                        YOLOv8-L • BotSORT
                                    </p>
                                </div>

                                {/* Zone Info */}
                                <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-2 rounded-lg backdrop-blur-sm flex items-center gap-2 z-10">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                    <p className="text-white text-sm font-medium">{selectedCamera.zone}</p>
                                </div>

                                {/* Detection count */}
                                <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-2 rounded-lg backdrop-blur-sm z-10">
                                    <p className="text-white text-sm">
                                        {detections.length} detections
                                    </p>
                                </div>

                                {/* Detection Bounding Boxes */}
                                {detections.map((detection, index) => (
                                    <BoundingBox key={index} detection={detection} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detection Details Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Active Detections</CardTitle>
                            <p className="text-sm text-gray-600">Real-time PPE status</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 max-h-125 overflow-y-auto">
                                {detections.filter(d => d.type !== 'person').length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No PPE detected</p>
                                    </div>
                                ) : (
                                    detections.filter(d => d.type !== 'person').map((detection, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-lg border-2 ${detection.status === 'safe' ? 'bg-green-50 border-green-200' :
                                                detection.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                                                    'bg-red-50 border-red-200'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    {detection.status === 'safe' ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                    ) : detection.status === 'warning' ? (
                                                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                                    ) : (
                                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-sm text-gray-900 capitalize">
                                                            {detection.type.replace('_', ' ')}
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            Confidence: {(detection.confidence * 100).toFixed(1)}%
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant={
                                                        detection.status === 'safe' ? 'default' :
                                                            detection.status === 'warning' ? 'secondary' :
                                                                'destructive'
                                                    }
                                                    className="text-xs"
                                                >
                                                    {detection.status.toUpperCase()}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Detection Legend */}
            <Card>
                <CardHeader>
                    <CardTitle>Detection Status Guide</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 border-4 border-green-500 rounded-lg flex items-center justify-center shrink-0">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-900">Safe - Compliant</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    PPE properly detected with high confidence. Worker is following safety protocols.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 border-4 border-yellow-500 rounded-lg flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-yellow-900">Warning - Low Confidence</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    PPE detection confidence is low. Requires verification or better camera angle.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 border-4 border-red-500 rounded-lg flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-red-900">Critical - Violation</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Required PPE not detected. Immediate intervention required for worker safety.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function BoundingBox({ detection }: { detection: Detection }) {
    const getColor = () => {
        switch (detection.status) {
            case 'safe': return 'rgb(34, 197, 94)'; // green-500
            case 'warning': return 'rgb(234, 179, 8)'; // yellow-500
            case 'critical': return 'rgb(239, 68, 68)'; // red-500
            default: return 'rgb(156, 163, 175)'; // gray-400
        }
    };

    return (
        <div
            className="absolute transition-all duration-100 ease-linear pointer-events-none"
            style={{
                left: `${detection.bbox.x}px`,
                top: `${detection.bbox.y}px`,
                width: `${detection.bbox.width}px`,
                height: `${detection.bbox.height}px`,
                border: `3px solid ${getColor()}`,
                boxShadow: `0 0 15px ${getColor()}60`,
                zIndex: 20 // Ensure bounding boxes are above the video
            }}
        >
            {/* Label */}
            <div
                className="absolute -top-7 left-0 px-2 py-1 text-xs font-bold text-white rounded shadow-lg uppercase"
                style={{ backgroundColor: getColor(), zIndex: 21 }}
            >
                {detection.type} {(detection.confidence * 100).toFixed(0)}%
            </div>
        </div>
    );
}
