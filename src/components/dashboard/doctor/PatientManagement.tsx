
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Download, 
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PatientManagementProps {
  userRole: string;
}

export const PatientManagement = ({ userRole }: PatientManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const { toast } = useToast();

  const [patients] = useState([
    {
      id: 1,
      code: 'PT001',
      name: 'Nguyễn Văn A',
      age: 45,
      gender: 'Nam',
      phone: '0123456789',
      address: 'Hà Nội',
      assignedDoctor: 'BS. Trần Văn B',
      assignedDate: '2024-01-10',
      lastVisit: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      code: 'PT002',
      name: 'Trần Thị B',
      age: 38,
      gender: 'Nữ',
      phone: '0987654321',
      address: 'TP.HCM',
      assignedDoctor: 'BS. Nguyễn Thị C',
      assignedDate: '2024-01-12',
      lastVisit: '2024-01-14',
      status: 'active'
    }
  ]);

  const handleDownloadPDF = (patient: any) => {
    const pdfContent = `
      THÔNG TIN CHI TIẾT BỆNH NHÂN
      ============================
      
      THÔNG TIN CƠ BẢN:
      - Mã bệnh nhân: ${patient.code}
      - Họ tên: ${patient.name}
      - Tuổi: ${patient.age}
      - Giới tính: ${patient.gender}
      - Số điện thoại: ${patient.phone}
      - Địa chỉ: ${patient.address}
      - Bác sĩ chỉ định: ${patient.assignedDoctor}
      - Ngày phân công: ${patient.assignedDate}
      - Lần khám gần nhất: ${patient.lastVisit}
      - Trạng thái: ${patient.status === 'active' ? 'Đang điều trị' : 'Ngưng điều trị'}
      
      LỊCH SỬ XÉT NGHIỆM CHI TIẾT:
      - Mã xét nghiệm: XN_240115_001
      - Ngày xét nghiệm: 2024-01-15
      - Thời gian xét nghiệm chính xác: 2024-01-15 09:30:45
      - Thời gian chẩn đoán chính xác: 2024-01-15 14:35:27
      - Chẩn đoán: Tiểu đường type 2
      - Điểm nguy cơ: 85/100
      - Chỉ số sinh học:
        + GLUCOSE: 180
        + HBA1C: 8.5
        + CHOLESTEROL: 240
      - Kết luận bác sĩ: Bệnh nhân cần điều chỉnh chế độ ăn uống và dùng thuốc theo chỉ định
      
      ============================
      Báo cáo được tạo bởi SLSS Gentis
      Ngày tạo: ${new Date().toLocaleString('vi-VN')}
      Người tạo: Bác sĩ ${userRole === 'collaborator' ? 'Cộng tác' : 'Chính'}
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ThongTinBenhNhan_${patient.code}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Tải xuống thành công",
      description: `Thông tin chi tiết bệnh nhân ${patient.name} đã được tải xuống`,
    });
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý bệnh nhân</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã BN</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Tuổi</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.code}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>
                    <Badge variant={patient.status === 'active' ? "default" : "secondary"}>
                      {patient.status === 'active' ? 'Đang điều trị' : 'Ngưng điều trị'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex space-x-2 justify-end">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Xem
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadPDF(patient)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Tải về
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Patient Detail Dialog - Basic Info Only */}
      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thông tin cơ bản - {selectedPatient.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-slate-600">Mã bệnh nhân:</label>
                    <p className="font-medium">{selectedPatient.code}</p>
                  </div>
                  <div>
                    <label className="text-slate-600">Họ tên:</label>
                    <p className="font-medium">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <label className="text-slate-600">Tuổi:</label>
                    <p className="font-medium">{selectedPatient.age} tuổi</p>
                  </div>
                  <div>
                    <label className="text-slate-600">Giới tính:</label>
                    <p className="font-medium">{selectedPatient.gender}</p>
                  </div>
                  <div>
                    <label className="text-slate-600">Số điện thoại:</label>
                    <p className="font-medium">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <label className="text-slate-600">Địa chỉ:</label>
                    <p className="font-medium">{selectedPatient.address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Lưu ý quan trọng</h3>
                <p className="text-yellow-700 text-sm">
                  • Thông tin chi tiết về lịch sử xét nghiệm, kết quả chẩn đoán được cung cấp trong file tải về.<br/>
                  • Để xem đầy đủ thông tin, vui lòng tải file thông tin chi tiết.<br/>
                  • Thông tin hiển thị ở đây chỉ mang tính chất tham khảo cơ bản.
                </p>
              </div>

              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    handleDownloadPDF(selectedPatient);
                    setSelectedPatient(null);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tải thông tin chi tiết
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedPatient(null)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
