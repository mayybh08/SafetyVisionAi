import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { mockEmployees } from '@/app/data/mockData';
import type { Employee } from '@/app/data/mockData';

export function EmployeeRecords() {
    const [searchTerm, setSearchTerm] = useState('');
    const [employees] = useState<Employee[]>(mockEmployees);

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatLastViolation = (date: Date | null) => {
        if (!date) return 'Never';

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return `${Math.floor(diffMins / 1440)}d ago`;
    };

    const getPPEStatus = (employee: Employee) => {
        const total = 4;
        const compliant = [employee.helmet, employee.goggles, employee.mask, employee.shoes].filter(Boolean).length;
        return { compliant, total, percentage: (compliant / total) * 100 };
    };

    const getStatusBadge = (percentage: number) => {
        if (percentage === 100) return <Badge className="bg-green-600">Full Compliance</Badge>;
        if (percentage >= 75) return <Badge variant="secondary">Partial Compliance</Badge>;
        return <Badge variant="destructive">Non-Compliant</Badge>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Employee Safety Records</h1>
                <p className="text-gray-600 mt-1">Individual PPE compliance tracking via face recognition</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Total Employees</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{employees.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Fully Compliant</p>
                            <p className="text-3xl font-bold text-green-600 mt-1">
                                {employees.filter(e => getPPEStatus(e).percentage === 100).length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Non-Compliant</p>
                            <p className="text-3xl font-bold text-red-600 mt-1">
                                {employees.filter(e => getPPEStatus(e).percentage < 100).length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Total Violations</p>
                            <p className="text-3xl font-bold text-orange-600 mt-1">
                                {employees.reduce((sum, e) => sum + e.totalViolations, 0)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Employee Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Employee Safety Details</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>Employee ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>PPE Status</TableHead>
                                    <TableHead className="text-center">Helmet</TableHead>
                                    <TableHead className="text-center">Goggles</TableHead>
                                    <TableHead className="text-center">Mask</TableHead>
                                    <TableHead className="text-center">Shoes</TableHead>
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0"></div>
                                    <TableHead>Last Violation</TableHead>
                                    <TableHead>Compliance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEmployees.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                                            No employees found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredEmployees.map((employee) => {
                                        const ppeStatus = getPPEStatus(employee);
                                        return (
                                            <TableRow key={employee.id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium">{employee.id}</TableCell>
                                                <TableCell>{employee.name}</TableCell>
                                                <TableCell>
                                                    {getStatusBadge(ppeStatus.percentage)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {employee.helmet ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {employee.goggles ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {employee.mask ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {employee.shoes ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className={`font-medium ${employee.totalViolations > 5 ? 'text-red-600' :
                                                        employee.totalViolations > 0 ? 'text-orange-600' :
                                                            'text-green-600'
                                                        }`}>
                                                        {employee.totalViolations}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        {employee.lastViolation && (
                                                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                                                        )}
                                                        <span className="text-sm text-gray-600">
                                                            {formatLastViolation(employee.lastViolation)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                                                            <div
                                                                className={`h-2 rounded-full ${ppeStatus.percentage === 100 ? 'bg-green-500' :
                                                                    ppeStatus.percentage >= 75 ? 'bg-yellow-500' :
                                                                        'bg-red-500'
                                                                    }`}
                                                                style={{ width: `${ppeStatus.percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-600 w-10">
                                                            {ppeStatus.percentage.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Table Footer Info */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <div>
                            Showing {filteredEmployees.length} of {employees.length} employees
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Compliant</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span>Non-Compliant</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Face Recognition Info */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-900">Face Recognition System</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Employee identification is performed using advanced face recognition algorithms integrated with YOLOv8.
                                The system maintains a 96.5% accuracy rate in identifying employees and tracking their PPE compliance in real-time.
                                All data is processed locally and complies with privacy regulations.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
