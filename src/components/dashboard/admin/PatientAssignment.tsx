
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, UserPlus, X } from 'lucide-react';

export const PatientAssignment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);

  const [doctors] = useState([
    { id: 1, name: 'BS. Nguyễn Văn A', role: 'doctor', phone: '0901234567' },
    { id: 2, name: 'BS. Trần Thị B', role: 'collaborator', phone: '0902345678' },
    { id: 3, name: 'BS. Lê Văn C', role: 'collaborator', phone: '0903456789' }
  ]);

  const [patients] = useState([
    {
      id: 1,
      code: 'PT001',
      name: 'Nguyễn Văn A',
      age: 45,
      gender: 'Nam',
      phone: '0901234567',
      assignedTo: null,
      riskLevel: 'high'
    },
    {
      id: 2,
      code: 'PT002',
      name: 'Trần Thị B',
      age: 38,
      gender: 'Nữ',
      phone: '0902345678',
      assignedTo: 'BS. Nguyễn Văn A',
      riskLevel: 'medium'
    },
    {
      id: 3,
      code: 'PT003',
      name: 'Lê Văn C',
      age: 52,
      gender: 'Nam',
      phone: '0903456789',
      assignedTo: 'BS. Trần Thị B',
      riskLevel: 'high'
    },
    {
      id: 4,
      code: 'PT004',
      name: 'Phạm Thị D',
      age: 35,
      gender: 'Nữ',
      phone: '0904567890',
      assignedTo: null,
      riskLevel: 'low'
    }
  ]);

  const [assignments, setAssignments] = useState([
    { patientId: 2, doctorId: 1, date: '2024-01-15' },
    { patientId: 3, doctorId: 2, date: '2024-01-14' }
  ]);

  const handleBulkAssignment = () => {
    if (selectedDoctor && selectedPatients.length > 0) {
      const newAssignments = selectedPatients.map(patientId => ({
        patientId,
        doctorId: parseInt(selectedDoctor),
        date: new Date().toISOString().split('T')[0]
      }));
      
      setAssignments([...assignments, ...newAssignments]);
      setSelectedPatients([]);
      setSelectedDoctor('');
      
      console.log('Phân công thành công:', newAssignments);
    }
  };

  const handleRemoveAssignment = (patientId: number) => {
    setAssignments(assignments.filter(a => a.patientId !== patientId));
    console.log('Hủy phân công bệnh nhân:', patientId);
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge variant="destructive">Nguy cơ cao</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Nguy cơ trung bình</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Nguy cơ thấp</Badge>;
      default:
        return <Badge variant="secondary">Chưa đánh giá</Badge>;
    }
  };

  const getPatientAssignedDoctor = (patientId: number) => {
    const assignment = assignments.find(a => a.patientId === patientId);
    if (assignment) {
      const doctor = doctors.find(d => d.id === assignment.doctorId);
      return doctor?.name || null;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Phân công bệnh nhân</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Phân công hàng loạt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Phân công bệnh nhân hàng loạt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Chọn bác sĩ</label>
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn bác sĩ để phân công" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name} ({doctor.role === 'doctor' ? 'Bác sĩ Gentis' : 'Bác sĩ cộng tác'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Chọn bệnh nhân ({selectedPatients.length} đã chọn)
                </label>
                <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-2">
                  {patients.filter(p => !getPatientAssignedDoctor(p.id)).map((patient) => (
                    <div key={patient.id} className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedPatients.includes(patient.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPatients([...selectedPatients, patient.id]);
                          } else {
                            setSelectedPatients(selectedPatients.filter(id => id !== patient.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{patient.name} ({patient.code})</p>
                        <p className="text-sm text-slate-600">{patient.age} tuổi • {patient.gender}</p>
                      </div>
                      {getRiskBadge(patient.riskLevel)}
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={handleBulkAssignment}
                disabled={!selectedDoctor || selectedPatients.length === 0}
              >
                Phân công {selectedPatients.length} bệnh nhân
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
              <p className="text-sm text-slate-600">Tổng bệnh nhân</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{assignments.length}</p>
              <p className="text-sm text-slate-600">Đã phân công</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {patients.length - assignments.length}
              </p>
              <p className="text-sm text-slate-600">Chưa phân công</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {doctors.filter(d => d.role === 'collaborator').length}
              </p>
              <p className="text-sm text-slate-600">Bác sĩ cộng tác</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 font-medium text-slate-600">Bệnh nhân</th>
                  <th className="text-left p-3 font-medium text-slate-600">Thông tin</th>
                  <th className="text-left p-3 font-medium text-slate-600">Nguy cơ</th>
                  <th className="text-left p-3 font-medium text-slate-600">Được phân công cho</th>
                  <th className="text-left p-3 font-medium text-slate-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => {
                  const assignedDoctor = getPatientAssignedDoctor(patient.id);
                  return (
                    <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-slate-800">{patient.name}</p>
                          <p className="text-sm text-slate-600">Mã: {patient.code}</p>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600">
                        <p>{patient.age} tuổi • {patient.gender}</p>
                        <p className="text-sm">{patient.phone}</p>
                      </td>
                      <td className="p-3">
                        {getRiskBadge(patient.riskLevel)}
                      </td>
                      <td className="p-3">
                        {assignedDoctor ? (
                          <Badge variant="default">{assignedDoctor}</Badge>
                        ) : (
                          <Badge variant="secondary">Chưa phân công</Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          {assignedDoctor ? (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleRemoveAssignment(patient.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <UserPlus className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Phân công bệnh nhân: {patient.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Chọn bác sĩ</label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Chọn bác sĩ" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {doctors.map((doctor) => (
                                          <SelectItem key={doctor.id} value={doctor.id.toString()}>
                                            {doctor.name} ({doctor.role === 'doctor' ? 'Bác sĩ Gentis' : 'Bác sĩ cộng tác'})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button className="w-full bg-red-600 hover:bg-red-700">
                                    Phân công
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
