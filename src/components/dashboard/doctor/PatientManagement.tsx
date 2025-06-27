import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Eye, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PatientManagementProps {
  userRole: string;
}

export const PatientManagement = ({ userRole }: PatientManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingPatient, setViewingPatient] = useState<any>(null);
  const isCollaborator = userRole === 'collaborator';
  const { toast } = useToast();
  
  const [patients] = useState(isCollaborator ? [
    {
      id: 3,
      code: 'PT003',
      name: 'Lê Văn C',
      age: 52,
      gender: 'Nam',
      phone: '0903456789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      email: 'levanc@email.com',
      insuranceNumber: 'HS1234567890',
      lastVisit: '2024-01-13',
      riskLevel: 'high',
      testsCount: 2,
      diagnoses: ['Gan nhiễm mỡ'],
      assignedBy: 'Admin Gentis',
      assignedDoctor: 'BS. Nguyễn Văn A',
      testResults: [
        { date: '2024-01-13', code: 'XN001', diagnosis: 'Gan nhiễm mỡ', riskScore: 78 },
        { date: '2024-01-10', code: 'XN002', diagnosis: 'Tăng men gan', riskScore: 65 }
      ]
    },
    {
      id: 5,
      code: 'PT005',
      name: 'Hoàng Thị E',
      age: 41,
      gender: 'Nữ',
      phone: '0905678901',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      email: 'hoangthie@email.com',
      insuranceNumber: 'HS0987654321',
      lastVisit: '2024-01-12',
      riskLevel: 'medium',
      testsCount: 1,
      diagnoses: ['Tăng huyết áp'],
      assignedBy: 'Admin Gentis',
      assignedDoctor: 'BS. Trần Thị B',
      testResults: [
        { date: '2024-01-12', code: 'XN003', diagnosis: 'Tăng huyết áp', riskScore: 55 }
      ]
    }
  ] : [
    {
      id: 1,
      code: 'PT001',
      name: 'Nguyễn Văn A',
      age: 45,
      gender: 'Nam',
      phone: '0901234567',
      address: '789 Đường DEF, Quận 7, TP.HCM',
      email: 'nguyenvana@email.com',
      insuranceNumber: 'HS1111111111',
      lastVisit: '2024-01-15',
      riskLevel: 'high',
      testsCount: 3,
      diagnoses: ['Tiểu đường type 2', 'Tăng huyết áp'],
      assignedDoctor: 'BS. Gentis System',
      testResults: [
        { date: '2024-01-15', code: 'XN004', diagnosis: 'Tiểu đường type 2', riskScore: 85 },
        { date: '2024-01-12', code: 'XN005', diagnosis: 'Tăng huyết áp', riskScore: 72 },
        { date: '2024-01-10', code: 'XN006', diagnosis: 'Rối loạn lipid', riskScore: 68 }
      ]
    },
    {
      id: 2,
      code: 'PT002',
      name: 'Trần Thị B',
      age: 38,
      gender: 'Nữ',
      phone: '0902345678',
      address: '321 Đường GHI, Quận 5, TP.HCM',
      email: 'tranthib@email.com',
      insuranceNumber: 'HS2222222222',
      lastVisit: '2024-01-14',
      riskLevel: 'medium',
      testsCount: 2,
      diagnoses: ['Rối loạn lipid'],
      assignedDoctor: 'BS. Gentis System',
      testResults: [
        { date: '2024-01-14', code: 'XN007', diagnosis: 'Rối loạn lipid', riskScore: 65 },
        { date: '2024-01-11', code: 'XN008', diagnosis: 'Thiếu máu nhẹ', riskScore: 45 }
      ]
    },
    {
      id: 3,
      code: 'PT003',
      name: 'Lê Văn C',
      age: 52,
      gender: 'Nam',
      phone: '0903456789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      email: 'levanc@email.com',
      insuranceNumber: 'HS3333333333',
      lastVisit: '2024-01-13',
      riskLevel: 'low',
      testsCount: 1,
      diagnoses: [],
      assignedDoctor: 'BS. Gentis System',
      testResults: [
        { date: '2024-01-13', code: 'XN009', diagnosis: 'Bình thường', riskScore: 25 }
      ]
    }
  ]);

  const handleDownloadTestResults = (patient: any) => {
    const pdfContent = `
      BÁO CÁO SỐ LIỆU XÉT NGHIỆM
      ===========================
      
      THÔNG TIN BỆNH NHÂN:
      - Họ tên: ${patient.name}
      - Mã BN: ${patient.code}
      - Tuổi: ${patient.age}
      - Giới tính: ${patient.gender}
      - Số điện thoại: ${patient.phone}
      - Email: ${patient.email}
      - Địa chỉ: ${patient.address}
      - Số BHYT: ${patient.insuranceNumber}
      - Bác sĩ chỉ định: ${patient.assignedDoctor}
      
      KẾT QUẢ XÉT NGHIỆM:
      ${patient.testResults.map((result: any, index: number) => `
      ${index + 1}. Ngày: ${result.date} - Mã XN: ${result.code}
         Chẩn đoán: ${result.diagnosis}
         Điểm nguy cơ: ${result.riskScore}/100
      `).join('')}
      
      TỔNG KẾT:
      - Tổng số xét nghiệm: ${patient.testsCount}
      - Mức độ nguy cơ: ${patient.riskLevel === 'high' ? 'Cao' : patient.riskLevel === 'medium' ? 'Trung bình' : 'Thấp'}
      - Lần khám cuối: ${patient.lastVisit}
      
      ===========================
      Báo cáo được tạo bởi SLSS Gentis
      Ngày tạo: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SoLieuXetNghiem_${patient.code}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Tải xuống thành công",
      description: `Số liệu xét nghiệm của bệnh nhân ${patient.name} đã được tải xuống`,
    });
  };

  const handleAddPatient = (formData: FormData) => {
    const newPatient = {
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      gender: formData.get('gender') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    };
    
    console.log('Thêm bệnh nhân mới:', newPatient);
    toast({
      title: "Thêm bệnh nhân thành công",
      description: `Bệnh nhân ${newPatient.name} đã được thêm vào hệ thống`,
    });
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
                      <p className="text-sm text-green-600 font-medium">
                        Bác sĩ chỉ định: {patient.assignedDoctor}
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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setViewingPatient(patient)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Xem
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleDownloadTestResults(patient)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Tải SL XN
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

      {/* Patient Detail Dialog */}
      {viewingPatient && (
        <Dialog open={!!viewingPatient} onOpenChange={() => setViewingPatient(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thông tin chi tiết bệnh nhân - {viewingPatient.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Patient Basic Info */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-3">Thông tin cơ bản</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Họ tên:</label>
                    <p className="font-medium">{viewingPatient.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Mã bệnh nhân:</label>
                    <p className="font-medium">{viewingPatient.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Tuổi:</label>
                    <p className="font-medium">{viewingPatient.age}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Giới tính:</label>
                    <p className="font-medium">{viewingPatient.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Số điện thoại:</label>
                    <p className="font-medium">{viewingPatient.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Email:</label>
                    <p className="font-medium">{viewingPatient.email}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-slate-600">Địa chỉ:</label>
                    <p className="font-medium">{viewingPatient.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Số BHYT:</label>
                    <p className="font-medium">{viewingPatient.insuranceNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Bác sĩ chỉ định:</label>
                    <p className="font-medium text-green-600">{viewingPatient.assignedDoctor}</p>
                  </div>
                </div>
              </div>

              {/* Test Results History */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Lịch sử xét nghiệm</h3>
                <div className="space-y-3">
                  {viewingPatient.testResults.map((result: any, index: number) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">Mã XN: {result.code}</p>
                          <p className="text-sm text-slate-600">Ngày: {result.date}</p>
                        </div>
                        <Badge 
                          variant={result.riskScore >= 70 ? "destructive" : result.riskScore >= 50 ? "default" : "secondary"}
                        >
                          Điểm nguy cơ: {result.riskScore}
                        </Badge>
                      </div>
                      <p className="text-sm"><strong>Chẩn đoán:</strong> {result.diagnosis}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
