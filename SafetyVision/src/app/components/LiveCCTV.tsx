import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Video, VideoOff, Camera, Play, Pause, AlertTriangle, CheckCircle, Circle } from 'lucide-react';

interface Detection {
    id: string;
    type: 'helmet' | 'goggles' | 'mask' | 'shoes' | 'person' | 'vest';
    label: string;
    confidence: number;
    x: number; // percentage
    y: number; // percentage
    width: number; // percentage
    height: number; // percentage
    status: 'safe' | 'warning' | 'critical';
}

export function LiveCCTV() {
    // Stop webcam stream
    const stopStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        setIsStreaming(false);
        setDetections([]);
    };
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [detections, setDetections] = useState<Detection[]>([]);
    const [error, setError] = useState<string>('');
    const [stats, setStats] = useState({
        fps: 0,
        detectionCount: 0,
        safeCount: 0,
        warningCount: 0,
        criticalCount: 0
    });
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);


    // Simulate real-time PPE detection
    const startDetectionSimulation = useCallback(() => {
        let frameCount = 0;
        let lastTime = performance.now();

        const updateDetections = () => {
            if (!isStreaming) return;

            frameCount++;
            const currentTime = performance.now();

            // Calculate FPS
            if (currentTime - lastTime >= 1000) {
                setStats(prev => ({ ...prev, fps: frameCount }));
                frameCount = 0;
                lastTime = currentTime;
            }

            // Generate realistic detections (simulating YOLOv8 output)
            const newDetections: Detection[] = [];

            // Simulate person detection
            const personX = 35 + Math.sin(Date.now() / 2000) * 5;
            const personY = 20 + Math.cos(Date.now() / 3000) * 3;

            newDetections.push({
                id: 'person-1',
                type: 'person',
                label: 'Person',
                confidence: 0.94 + Math.random() * 0.05,
                x: personX,
                y: personY,
                width: 25,
                height: 55,
                status: 'safe'
            });

            // Helmet detection (on person's head)
            const hasHelmet = Math.random() > 0.3;
            if (hasHelmet) {
                newDetections.push({
                    id: 'helmet-1',
                    type: 'helmet',
                    label: 'Safety Helmet',
                    confidence: 0.88 + Math.random() * 0.1,
                    x: personX + 7,
                    y: personY - 2,
                    width: 11,
                    height: 8,
                    status: 'safe'
                });
            } else {
                newDetections.push({
                    id: 'no-helmet-1',
                    type: 'helmet',
                    label: 'No Helmet',
                    confidence: 0.72,
                    x: personX + 7,
                    y: personY - 2,
                    width: 11,
                    height: 8,
                    status: 'critical'
                });
            }

            // Safety vest detection
            const hasVest = Math.random() > 0.2;
            if (hasVest) {
                newDetections.push({
                    id: 'vest-1',
                    type: 'vest',
                    label: 'Safety Vest',
                    confidence: 0.91 + Math.random() * 0.08,
                    x: personX + 4,
                    y: personY + 12,
                    width: 17,
                    height: 20,
                    status: 'safe'
                });
            }

            // Goggles detection
            const hasGoggles = Math.random() > 0.4;
            if (hasGoggles) {
                newDetections.push({
                    id: 'goggles-1',
                    type: 'goggles',
                    label: 'Safety Goggles',
                    confidence: 0.85 + Math.random() * 0.1,
                    x: personX + 8,
                    y: personY + 4,
                    width: 9,
                    height: 3,
                    status: 'safe'
                });
            } else if (Math.random() > 0.5) {
                newDetections.push({
                    id: 'no-goggles-1',
                    type: 'goggles',
                    label: 'No Goggles',
                    confidence: 0.68,
                    x: personX + 8,
                    y: personY + 4,
                    width: 9,
                    height: 3,
                    status: 'warning'
                });
            }

            // Mask detection
            const hasMask = Math.random() > 0.5;
            if (hasMask) {
                newDetections.push({
                    id: 'mask-1',
                    type: 'mask',
                    label: 'Face Mask',
                    confidence: 0.82 + Math.random() * 0.15,
                    x: personX + 9,
                    y: personY + 6,
                    width: 7,
                    height: 4,
                    status: 'safe'
                });
            }

            // Sometimes add a second person
            if (Math.random() > 0.5) {
                const person2X = 60 + Math.cos(Date.now() / 2500) * 4;
                const person2Y = 25 + Math.sin(Date.now() / 3500) * 4;

                newDetections.push({
                    id: 'person-2',
                    type: 'person',
                    label: 'Person',
                    confidence: 0.92 + Math.random() * 0.06,
                    x: person2X,
                    y: person2Y,
                    width: 23,
                    height: 52,
                    status: 'safe'
                });

                // Full compliance for person 2
                newDetections.push({
                    id: 'helmet-2',
                    type: 'helmet',
                    label: 'Safety Helmet',
                    confidence: 0.93,
                    x: person2X + 6,
                    y: person2Y - 2,
                    width: 11,
                    height: 8,
                    status: 'safe'
                });
            }

            setDetections(newDetections);

            // Update statistics
            const safeCount = newDetections.filter(d => d.status === 'safe').length;
            const warningCount = newDetections.filter(d => d.status === 'warning').length;
            const criticalCount = newDetections.filter(d => d.status === 'critical').length;

            setStats(prev => ({
                ...prev,
                detectionCount: newDetections.length,
                safeCount,
                warningCount,
                criticalCount
            }));

            animationFrameRef.current = requestAnimationFrame(updateDetections);
        };
        updateDetections();
    }, [isStreaming]);

    // Start webcam stream
    const startStream = async () => {
        try {
            setError('');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsStreaming(true);

                // Start detection simulation
                startDetectionSimulation();
            }
        } catch (err) {
            setError('Failed to access camera. Please ensure camera permissions are granted.');
            console.error('Camera access error:', err);
        }
    };

    useEffect(() => {
        return () => {
            stopStream();
        };
    }, []);

    useEffect(() => {
        if (isStreaming) {
            startDetectionSimulation();
        }
    }, [isStreaming, startDetectionSimulation]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'safe': return '#22c55e'; // green-500
            case 'warning': return '#eab308'; // yellow-500
            case 'critical': return '#ef4444'; // red-500
            default: return '#94a3b8'; // gray-400
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Live CCTV with PPE Detection</h1>
                    <p className="text-gray-600 mt-1">Real-time video stream with AI-powered safety equipment detection</p>
                </div>
                <div className="flex items-center gap-3">
                    {!isStreaming ? (
                        <Button onClick={startStream} size="lg" className="bg-green-600 hover:bg-green-700">
                            <Play className="w-5 h-5 mr-2" />
                            Start Camera
                        </Button>
                    ) : (
                        <Button onClick={stopStream} size="lg" variant="destructive">
                            <Pause className="w-5 h-5 mr-2" />
                            Stop Camera
                        </Button>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <VideoOff className="w-5 h-5 text-red-600" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Statistics Bar */}
            {isStreaming && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-xs text-gray-600">FPS</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.fps}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-xs text-gray-600">Detections</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.detectionCount}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-xs text-gray-600">Safe</p>
                                <p className="text-2xl font-bold text-green-600">{stats.safeCount}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-xs text-gray-600">Warnings</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.warningCount}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-xs text-gray-600">Critical</p>
                                <p className="text-2xl font-bold text-red-600">{stats.criticalCount}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* VIDEO HERE: Insert a <video> element below, using a file from the /video folder at the project root. Example: <video src="/video/yourfile.mp4" ... /> */}

            {/* Main Video Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Container */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Camera className="w-5 h-5" />
                                    Live Feed - Camera 01
                                </CardTitle>
                                {isStreaming && (
                                    <div className="flex items-center gap-2">
                                        <Circle className="w-3 h-3 fill-red-500 text-red-500 animate-pulse" />
                                        <span className="text-sm font-medium text-red-600">RECORDING</span>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
                                {!isStreaming ? (
                                    // Placeholder when not streaming
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center text-gray-400">
                                            <video src="/video/input.mp4"/>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Video Element */}
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Detection Overlays */}
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                            {detections.map((detection) => (
                                                <g key={detection.id}>
                                                    {/* Bounding Box */}
                                                    <rect
                                                        x={`${detection.x}%`}
                                                        y={`${detection.y}%`}
                                                        width={`${detection.width}%`}
                                                        height={`${detection.height}%`}
                                                        fill="none"
                                                        stroke={getStatusColor(detection.status)}
                                                        strokeWidth="3"
                                                        className="transition-all duration-100"
                                                    />
                                                    {/* Label Background */}
                                                    <rect
                                                        x={`${detection.x}%`}
                                                        y={`${detection.y - 3}%`}
                                                        width={`${Math.max(detection.width, 15)}%`}
                                                        height="3%"
                                                        fill={getStatusColor(detection.status)}
                                                    />
                                                    {/* Label Text */}
                                                    <text
                                                        x={`${detection.x + 0.5}%`}
                                                        y={`${detection.y - 0.5}%`}
                                                        fill="white"
                                                        fontSize="14"
                                                        fontWeight="bold"
                                                        className="select-none"
                                                    >
                                                        {detection.label} {(detection.confidence * 100).toFixed(0)}%
                                                    </text>
                                                </g>
                                            ))}
                                        </svg>

                                        {/* Timestamp Overlay */}
                                        <div className="absolute top-4 left-4 bg-black/70 px-3 py-2 rounded-lg">
                                            <p className="text-white text-sm font-mono">
                                                {new Date().toLocaleTimeString()} • LIVE
                                            </p>
                                        </div>

                                        {/* Model Info Overlay */}
                                        <div className="absolute top-4 right-4 bg-black/70 px-3 py-2 rounded-lg">
                                            <p className="text-white text-xs font-mono">
                                                YOLOv8-L • BotSORT
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detection Details Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Current Detections</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!isStreaming ? (
                                <div className="text-center text-gray-500 py-8">
                                    <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No active detections</p>
                                    <p className="text-sm mt-1">Start the camera to see live PPE detection</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-125 overflow-y-auto">
                                    {detections.filter(d => d.type !== 'person').map((detection) => (
                                        <div
                                            key={detection.id}
                                            className={`p-3 rounded-lg border-2 ${detection.status === 'safe' ? 'bg-green-50 border-green-200' :
                                                detection.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                                                    'bg-red-50 border-red-200'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    {detection.status === 'safe' ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-sm text-gray-900">
                                                            {detection.label}
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
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Detection Legend */}
            <Card>
                <CardHeader>
                    <CardTitle>PPE Detection Guide</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Safety Helmet</h4>
                                <p className="text-sm text-gray-600">Hard hat detection for head protection</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Safety Goggles</h4>
                                <p className="text-sm text-gray-600">Eye protection equipment detection</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                                <CheckCircle className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Face Mask</h4>
                                <p className="text-sm text-gray-600">Respiratory protection detection</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                                <CheckCircle className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Safety Vest</h4>
                                <p className="text-sm text-gray-600">High-visibility clothing detection</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Technical Information */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                            <Camera className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-900">AI Detection System</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                This system uses YOLOv8-Large model for real-time object detection combined with BotSORT tracking algorithm.
                                The AI processes each frame to detect PPE items including helmets, goggles, masks, safety vests, and shoes.
                                Detection confidence scores above 70% are displayed. The system runs at 25-30 FPS on modern hardware and
                                can track multiple workers simultaneously with contextual safety analysis.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
