
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Download
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
  const isCollaborator = userRole === 'collaborator';
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
      status: 'active',
      tests: [
        {
          id: 1,
          code: 'XN_240115_001',
          date: '2024-01-15',
          testDateTime: '2024-01-15 09:30:45',
          diagnosisTime: '2024-01-15 14:35:27',
          diagnosis: 'Tiểu đường type 2',
          riskScore: 85,
          biomarkers: {
            glucose: 180,
            hba1c: 8.5,
            cholesterol: 240
          },
          doctorConclusion: 'Bệnh nhân cần điều chỉnh chế độ ăn uống và dùng thuốc theo chỉ định'
        }
      ]
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
      status: 'active',
      tests: [
        {
          id: 2,
          code: 'XN_240114_002',
          date: '2024-01-14',
          testDateTime: '2024-01-14 14:20:18',
          diagnosisTime: '2024-01-14 10:22:15',
          diagnosis: 'Rối loạn lipid máu',
          riskScore: 65,
          biomarkers: {
            totalCholesterol: 220,
            ldl: 140,
            hdl: 45
          },
          doctorConclusion: ''
        }
      ]
    }
  ]);

  const handleDownloadDetails = (patient: any) => {
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
      ${patient.tests.map((test: any) => `
      - Mã xét nghiệm: ${test.code}
      - Ngày xét nghiệm: ${test.date}
      - Thời gian xét nghiệm chính xác: ${test.testDateTime}
      - Thời gian chẩn đoán chính xác: ${test.diagnosisTime}
      - Chẩn đoán: ${test.diagnosis}
      - Điểm nguy cơ: ${test.riskScore}/100
      - Chỉ số sinh học:
        ${Object.entries(test.biomarkers).map(([key, value]) => `  + ${key.toUpperCase()}: ${value}`).join('\n        ')}
      - Kết luận bác sĩ: ${test.doctorConclusion || 'Chưa có kết luận'}
      `).join('\n      ')}
      
      KHUYẾN NGHỊ VÀ PHÂN TÍCH CHI TIẾT:
      - Tình trạng sức khỏe tổng quan: ${patient.tests.length > 0 ? patient.tests[0].diagnosis : 'Chưa có dữ liệu'}
      - Các chỉ số cần theo dõi: ${patient.tests.length > 0 ? Object.keys(patient.tests[0].biomarkers).join(', ').toUpperCase() : 'Chưa có dữ liệu'}
      - Lịch tái khám được khuyến nghị: 3-6 tháng
      - Ghi chú đặc biệt: Cần tuân thủ nghiêm ngặt chế độ điều trị
      
      ============================
      Báo cáo được tạo bởi SLSS Gentis
      Ngày tạo: ${new Date().toLocaleString('vi-VN')}
      Người tạo: Bác sĩ ${userRole === 'collaborator' ? 'Cộng tác' : 'Chính'}
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ThongTinChiTiet_${patient.code}.txt`;
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

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã bệnh nhân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patient Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bệnh nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã BN</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Tuổi</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-mono text-sm">{patient.code}</TableCell>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>
                    <Badge variant={patient.status === 'active' ? "default" : "secondary"}>
                      {patient.status === 'active' ? 'Đang điều trị' : 'Ngưng điều trị'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownloadDetails(patient)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Tải chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
