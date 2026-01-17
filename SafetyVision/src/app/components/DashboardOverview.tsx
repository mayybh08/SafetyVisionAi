import { Users, ShieldCheck, AlertTriangle, AlertCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { getDashboardStats } from '@/app/data/mockData';

export function DashboardOverview() {
  const stats = getDashboardStats();
  
  return (
    <div className="space-y-6">
      {/* Header with System Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Real-time industrial safety monitoring powered by AI</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <Activity className="w-5 h-5 text-green-600 animate-pulse" />
            <span className="font-medium text-green-700">Live Monitoring Active</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Workers Card */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Workers Detected
            </CardTitle>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalWorkers}</div>
            <p className="text-xs text-gray-600 mt-2">Active across all zones</p>
          </CardContent>
        </Card>

        {/* PPE Compliance Card */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              PPE Compliance Rate
            </CardTitle>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.ppeCompliance}%</div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.ppeCompliance}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Violations Today Card */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Safety Violations Today
            </CardTitle>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.violationsToday}</div>
            <p className="text-xs text-gray-600 mt-2">
              <Badge variant="outline" className="text-orange-600 border-orange-300">-12% vs yesterday</Badge>
            </p>
          </CardContent>
        </Card>

        {/* Critical Alerts Card */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Critical Alerts
            </CardTitle>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.criticalAlerts}</div>
            <p className="text-xs text-red-600 mt-2 font-medium">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>AI Detection System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Model Version</span>
                <Badge variant="secondary">YOLOv8-L</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tracking Algorithm</span>
                <Badge variant="secondary">BotSORT</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Cameras</span>
                <Badge className="bg-green-600">12/12 Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">FPS Average</span>
                <Badge variant="secondary">28.5 fps</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Detection Accuracy</span>
                <Badge className="bg-green-600">94.2%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">System Uptime</span>
                <Badge variant="secondary">99.8%</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
