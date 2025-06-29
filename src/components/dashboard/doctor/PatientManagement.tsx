
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Eye, 
  Download, 
  FileText,
  RefreshCw
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
  const [showConclusionDialog, setShowConclusionDialog] = useState(false);
  const [conclusion, setConclusion] = useState('');
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

  const handleReAnalyze = (patient: any, test: any) => {
    const newDiagnosisTime = new Date().toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    toast({
      title: "Phân tích lại hoàn tất",
      description: `Xét nghiệm ${test.code} của bệnh nhân ${patient.name} đã được phân tích lại`,
    });
    
    console.log('Phân tích lại:', {
      patientCode: patient.code,
      testCode: test.code,
      newDiagnosisTime,
      oldRiskScore: test.riskScore
    });
  };

  const handleSaveConclusion = (patient: any, test: any) => {
    toast({
      title: "Lưu kết luận thành công",
      description: `Kết luận cho bệnh nhân ${patient.name} đã được lưu`,
    });
    
    console.log('Lưu kết luận:', {
      patientCode: patient.code,
      testCode: test.code,
      conclusion
    });
    
    setShowConclusionDialog(false);
    setConclusion('');
  };

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
                <TableHead>Họ tên</TableHead>
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
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Chi tiết
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

      {/* Patient Detail Dialog - Simplified */}
      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thông tin tóm tắt - {selectedPatient.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-3">Thông tin cơ bản</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-slate-600">Họ tên:</label>
                    <p className="font-medium">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <label className="text-slate-600">Mã bệnh nhân:</label>
                    <p className="font-medium">{selectedPatient.code}</p>
                  </div>
                  <div>
                    <label className="text-slate-600">Tuổi/Giới tính:</label>
                    <p className="font-medium">{selectedPatient.age} tuổi, {selectedPatient.gender}</p>
                  </div>
                  <div>
                    <label className="text-slate-600">Bác sĩ chỉ định:</label>
                    <p className="font-medium">{selectedPatient.assignedDoctor}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Xét nghiệm gần nhất</h3>
                {selectedPatient.tests.length > 0 ? (
                  <div className="text-sm text-blue-700">
                    <p><strong>Mã XN:</strong> {selectedPatient.tests[0].code}</p>
                    <p><strong>Chẩn đoán:</strong> {selectedPatient.tests[0].diagnosis}</p>
                    <p><strong>Điểm nguy cơ:</strong> {selectedPatient.tests[0].riskScore}/100</p>
                  </div>
                ) : (
                  <p className="text-sm text-blue-700">Chưa có xét nghiệm</p>
                )}
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Lưu ý quan trọng</h3>
                <p className="text-yellow-700 text-sm">
                  • Thông tin chi tiết về bệnh nhân, lịch sử xét nghiệm được cung cấp trong file kết quả tải về.<br/>
                  • Để xem đầy đủ thông tin, vui lòng tải file thông tin chi tiết.<br/>
                  • Thông tin hiển thị ở đây chỉ mang tính chất tham khảo tổng quan.
                </p>
              </div>

              <div className="flex space-x-2">
                {selectedPatient.tests.length > 0 && (
                  <>
                    {!isCollaborator && (
                      <Button 
                        variant="outline"
                        onClick={() => handleReAnalyze(selectedPatient, selectedPatient.tests[0])}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Phân tích lại
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setConclusion(selectedPatient.tests[0].doctorConclusion || '');
                        setShowConclusionDialog(true);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {selectedPatient.tests[0].doctorConclusion ? 'Sửa kết luận' : 'Nhập kết luận'}
                    </Button>
                  </>
                )}
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
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

      {/* Conclusion Dialog */}
      {showConclusionDialog && selectedPatient && (
        <Dialog open={showConclusionDialog} onOpenChange={setShowConclusionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kết luận cuối cùng - {selectedPatient.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kết luận của bác sĩ:
                </label>
                <Textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="Nhập kết luận cuối cùng..."
                  rows={4}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleSaveConclusion(selectedPatient, selectedPatient.tests[0])}
                  disabled={!conclusion.trim()}
                >
                  Lưu kết luận
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConclusionDialog(false)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
