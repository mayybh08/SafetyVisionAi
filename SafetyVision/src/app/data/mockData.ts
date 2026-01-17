// Mock data for SafetyVision AI system
// Simulates YOLOv8 detection, BotSORT tracking, and contextual risk analysis

export interface Alert {
  id: string;
  timestamp: Date;
  cameraId: string;
  zone: string;
  violationType: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
}

export interface Employee {
  id: string;
  name: string;
  helmet: boolean;
  goggles: boolean;
  mask: boolean;
  shoes: boolean;
  totalViolations: number;
  lastViolation: Date | null;
}

export interface CameraFeed {
  id: string;
  name: string;
  zone: string;
  status: 'active' | 'inactive';
  detections: Detection[];
}

export interface Detection {
  type: 'helmet' | 'goggles' | 'mask' | 'shoes' | 'fire' | 'smoke' | 'person';
  status: 'safe' | 'warning' | 'critical';
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
}

export interface ViolationData {
  date: string;
  violations: number;
}

export interface ComplianceData {
  zone: string;
  compliance: number;
}

export interface ViolationTypeData {
  name: string;
  value: number;
}

export interface ZoneRisk {
  id: string;
  name: string;
  riskLevel: 'safe' | 'moderate' | 'high';
  workersCount: number;
  x: number;
  y: number;
}

// Generate random alerts
export const generateAlerts = (): Alert[] => {
  const violationTypes = [
    'No Helmet Detected',
    'No Safety Goggles',
    'No Mask',
    'Fire Detected',
    'Smoke Detected',
    'Restricted Area Access',
    'PPE Non-Compliance'
  ];
  
  const zones = ['Assembly Line A', 'Welding Zone B', 'Storage Area C', 'Loading Dock D', 'Machinery Hall E'];
  const severities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
  
  const alerts: Alert[] = [];
  const now = new Date();
  
  for (let i = 0; i < 15; i++) {
    const minutesAgo = Math.floor(Math.random() * 120);
    const timestamp = new Date(now.getTime() - minutesAgo * 60000);
    const violationType = violationTypes[Math.floor(Math.random() * violationTypes.length)];
    
    alerts.push({
      id: `alert-${i}`,
      timestamp,
      cameraId: `CAM-${Math.floor(Math.random() * 12) + 1}`,
      zone: zones[Math.floor(Math.random() * zones.length)],
      violationType,
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: `${violationType} in ${zones[Math.floor(Math.random() * zones.length)]}`
    });
  }
  
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Mock employee data
export const mockEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'John Anderson',
    helmet: true,
    goggles: true,
    mask: true,
    shoes: true,
    totalViolations: 2,
    lastViolation: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'EMP-002',
    name: 'Sarah Martinez',
    helmet: true,
    goggles: false,
    mask: true,
    shoes: true,
    totalViolations: 5,
    lastViolation: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    id: 'EMP-003',
    name: 'Michael Chen',
    helmet: false,
    goggles: true,
    mask: true,
    shoes: true,
    totalViolations: 8,
    lastViolation: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 'EMP-004',
    name: 'Emily Johnson',
    helmet: true,
    goggles: true,
    mask: true,
    shoes: true,
    totalViolations: 0,
    lastViolation: null
  },
  {
    id: 'EMP-005',
    name: 'David Wilson',
    helmet: true,
    goggles: true,
    mask: false,
    shoes: true,
    totalViolations: 3,
    lastViolation: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    id: 'EMP-006',
    name: 'Lisa Thompson',
    helmet: true,
    goggles: true,
    mask: true,
    shoes: false,
    totalViolations: 1,
    lastViolation: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: 'EMP-007',
    name: 'Robert Garcia',
    helmet: true,
    goggles: true,
    mask: true,
    shoes: true,
    totalViolations: 0,
    lastViolation: null
  },
  {
    id: 'EMP-008',
    name: 'Jennifer Lee',
    helmet: false,
    goggles: false,
    mask: true,
    shoes: true,
    totalViolations: 12,
    lastViolation: new Date(Date.now() - 15 * 60 * 1000)
  }
];

// Mock camera feeds with detections
export const mockCameraFeeds: CameraFeed[] = [
  {
    id: 'CAM-1',
    name: 'Assembly Line A - North',
    zone: 'Assembly Line A',
    status: 'active',
    detections: [
      { type: 'person', status: 'safe', confidence: 0.95, bbox: { x: 120, y: 80, width: 100, height: 180 } },
      { type: 'helmet', status: 'safe', confidence: 0.92, bbox: { x: 135, y: 75, width: 70, height: 50 } },
      { type: 'goggles', status: 'safe', confidence: 0.88, bbox: { x: 145, y: 95, width: 50, height: 20 } }
    ]
  },
  {
    id: 'CAM-2',
    name: 'Welding Zone B - East',
    zone: 'Welding Zone B',
    status: 'active',
    detections: [
      { type: 'person', status: 'warning', confidence: 0.93, bbox: { x: 200, y: 100, width: 90, height: 170 } },
      { type: 'helmet', status: 'warning', confidence: 0.45, bbox: { x: 215, y: 95, width: 60, height: 45 } },
      { type: 'fire', status: 'critical', confidence: 0.87, bbox: { x: 50, y: 200, width: 80, height: 60 } }
    ]
  },
  {
    id: 'CAM-3',
    name: 'Storage Area C - West',
    zone: 'Storage Area C',
    status: 'active',
    detections: [
      { type: 'person', status: 'critical', confidence: 0.96, bbox: { x: 150, y: 90, width: 95, height: 175 } },
      { type: 'smoke', status: 'critical', confidence: 0.76, bbox: { x: 280, y: 50, width: 120, height: 150 } }
    ]
  },
  {
    id: 'CAM-4',
    name: 'Loading Dock D - South',
    zone: 'Loading Dock D',
    status: 'active',
    detections: [
      { type: 'person', status: 'safe', confidence: 0.94, bbox: { x: 100, y: 70, width: 105, height: 185 } },
      { type: 'helmet', status: 'safe', confidence: 0.91, bbox: { x: 115, y: 65, width: 75, height: 55 } },
      { type: 'shoes', status: 'safe', confidence: 0.89, bbox: { x: 110, y: 230, width: 85, height: 25 } }
    ]
  },
  {
    id: 'CAM-5',
    name: 'Machinery Hall E - Center',
    zone: 'Machinery Hall E',
    status: 'active',
    detections: [
      { type: 'person', status: 'warning', confidence: 0.92, bbox: { x: 180, y: 95, width: 88, height: 165 } },
      { type: 'mask', status: 'warning', confidence: 0.52, bbox: { x: 195, y: 115, width: 58, height: 35 } }
    ]
  },
  {
    id: 'CAM-6',
    name: 'Assembly Line A - South',
    zone: 'Assembly Line A',
    status: 'active',
    detections: [
      { type: 'person', status: 'safe', confidence: 0.97, bbox: { x: 130, y: 85, width: 92, height: 178 } },
      { type: 'helmet', status: 'safe', confidence: 0.94, bbox: { x: 142, y: 80, width: 68, height: 48 } }
    ]
  }
];

// Violations over time (last 7 days)
export const violationsOverTime: ViolationData[] = [
  { date: '2026-01-10', violations: 12 },
  { date: '2026-01-11', violations: 15 },
  { date: '2026-01-12', violations: 9 },
  { date: '2026-01-13', violations: 18 },
  { date: '2026-01-14', violations: 14 },
  { date: '2026-01-15', violations: 11 },
  { date: '2026-01-16', violations: 8 }
];

// PPE compliance per zone
export const complianceByZone: ComplianceData[] = [
  { zone: 'Assembly A', compliance: 92 },
  { zone: 'Welding B', compliance: 78 },
  { zone: 'Storage C', compliance: 85 },
  { zone: 'Loading D', compliance: 88 },
  { zone: 'Machinery E', compliance: 81 }
];

// Violation types distribution
export const violationTypes: ViolationTypeData[] = [
  { name: 'No Helmet', value: 35 },
  { name: 'No Goggles', value: 22 },
  { name: 'No Mask', value: 18 },
  { name: 'No Shoes', value: 12 },
  { name: 'Fire/Smoke', value: 8 },
  { name: 'Other', value: 5 }
];

// Zone risk heatmap
export const zoneRiskData: ZoneRisk[] = [
  { id: 'zone-1', name: 'Assembly Line A', riskLevel: 'safe', workersCount: 12, x: 15, y: 15 },
  { id: 'zone-2', name: 'Welding Zone B', riskLevel: 'high', workersCount: 8, x: 45, y: 15 },
  { id: 'zone-3', name: 'Storage Area C', riskLevel: 'moderate', workersCount: 6, x: 75, y: 15 },
  { id: 'zone-4', name: 'Loading Dock D', riskLevel: 'safe', workersCount: 10, x: 15, y: 55 },
  { id: 'zone-5', name: 'Machinery Hall E', riskLevel: 'moderate', workersCount: 15, x: 45, y: 55 },
  { id: 'zone-6', name: 'Quality Control F', riskLevel: 'safe', workersCount: 7, x: 75, y: 55 }
];

// Dashboard statistics
export const getDashboardStats = () => {
  const totalWorkers = zoneRiskData.reduce((sum, zone) => sum + zone.workersCount, 0);
  const ppeCompliance = Math.round(
    complianceByZone.reduce((sum, zone) => sum + zone.compliance, 0) / complianceByZone.length
  );
  const violationsToday = violationsOverTime[violationsOverTime.length - 1].violations;
  const criticalAlerts = generateAlerts().filter(a => a.severity === 'High').length;
  
  return {
    totalWorkers,
    ppeCompliance,
    violationsToday,
    criticalAlerts
  };
};
