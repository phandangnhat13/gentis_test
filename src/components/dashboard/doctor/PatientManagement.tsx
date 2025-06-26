
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Eye } from 'lucide-react';

interface PatientManagementProps {
  userRole: string;
}

export const PatientManagement = ({ userRole }: PatientManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isCollaborator = userRole === 'collaborator';
  
  // Dữ liệu bệnh nhân khác nhau cho từng vai trò
  const [patients] = useState(isCollaborator ? [
    {
      id: 3,
      code: 'PT003',
      name: 'Lê Văn C',
      age: 52,
      gender: 'Nam',
      phone: '0903456789',
      lastVisit: '2024-01-13',
      riskLevel: 'high',
      testsCount: 2,
      diagnoses: ['Gan nhiễm mỡ'],
      assignedBy: 'Admin Gentis'
    },
    {
      id: 5,
      code: 'PT005',
      name: 'Hoàng Thị E',
      age: 41,
      gender: 'Nữ',
      phone: '0905678901',
      lastVisit: '2024-01-12',
      riskLevel: 'medium',
      testsCount: 1,
      diagnoses: ['Tăng huyết áp'],
      assignedBy: 'Admin Gentis'
    }
  ] : [
    {
      id: 1,
      code: 'PT001',
      name: 'Nguyễn Văn A',
      age: 45,
      gender: 'Nam',
      phone: '0901234567',
      lastVisit: '2024-01-15',
      riskLevel: 'high',
      testsCount: 3,
      diagnoses: ['Tiểu đường type 2', 'Tăng huyết áp']
    },
    {
      id: 2,
      code: 'PT002',
      name: 'Trần Thị B',
      age: 38,
      gender: 'Nữ',
      phone: '0902345678',
      lastVisit: '2024-01-14',
      riskLevel: 'medium',
      testsCount: 2,
      diagnoses: ['Rối loạn lipid']
    },
    {
      id: 3,
      code: 'PT003',
      name: 'Lê Văn C',
      age: 52,
      gender: 'Nam',
      phone: '0903456789',
      lastVisit: '2024-01-13',
      riskLevel: 'low',
      testsCount: 1,
      diagnoses: []
    }
  ]);

  const handleAddPatient = (formData: FormData) => {
    const newPatient = {
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      gender: formData.get('gender') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    };
    
    console.log('Thêm bệnh nhân mới:', newPatient);
    // TODO: Gọi API để thêm bệnh nhân
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          {isCollaborator ? 'Bệnh nhân được phân công' : 'Quản lý bệnh nhân'}
        </h2>
        {!isCollaborator && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Thêm bệnh nhân
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm bệnh nhân mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddPatient(new FormData(e.currentTarget));
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Họ tên</label>
                    <Input name="name" placeholder="Nhập họ tên" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tuổi</label>
                    <Input name="age" type="number" placeholder="Nhập tuổi" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Giới tính</label>
                    <select name="gender" className="w-full p-2 border border-slate-300 rounded-md" required>
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                    <Input name="phone" placeholder="Nhập số điện thoại" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                  <Input name="address" placeholder="Nhập địa chỉ" />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Thêm bệnh nhân</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {patients.map((patient) => (
              <Card key={patient.id} className="border border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <p className="text-sm text-slate-600">
                        Mã BN: {patient.code}
                        {isCollaborator && patient.assignedBy && (
                          <span className="ml-2 text-blue-600">• Phân công bởi: {patient.assignedBy}</span>
                        )}
                      </p>
                    </div>
                    {getRiskBadge(patient.riskLevel)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Tuổi:</span>
                      <span className="ml-2 font-medium">{patient.age}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Giới tính:</span>
                      <span className="ml-2 font-medium">{patient.gender}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">SĐT:</span>
                      <span className="ml-2 font-medium">{patient.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Lần khám cuối:</span>
                      <span className="ml-2 font-medium">{patient.lastVisit}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-slate-600">Số xét nghiệm:</span>
                    <span className="ml-2 font-medium">{patient.testsCount}</span>
                  </div>

                  {patient.diagnoses.length > 0 && (
                    <div className="text-sm">
                      <span className="text-slate-600 block mb-1">Chẩn đoán liên quan:</span>
                      <div className="flex flex-wrap gap-1">
                        {patient.diagnoses.map((diagnosis, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {diagnosis}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Xem
                    </Button>
                    {!isCollaborator && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Sửa
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
