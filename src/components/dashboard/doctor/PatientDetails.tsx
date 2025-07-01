
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, Calendar, User, Phone, MapPin, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PatientDetailsProps {
  patient: {
    id: number;
    code: string;
    name: string;
    age: number;
    gender: string;
    phone: string;
    address: string;
    assignedDoctor: string;
    assignedDate: string;
    lastVisit: string;
    status: string;
    tests: any[];
  };
  userRole: string;
}

export const PatientDetails = ({ patient, userRole }: PatientDetailsProps) => {
  const { toast } = useToast();
  const isCollaborator = userRole === 'collaborator';

  const handleDownloadReport = () => {
    const reportContent = `
      BÁO CÁO BỆNH NHÂN CHI TIẾT
      ==========================
      
      THÔNG TIN BỆNH NHÂN:
      - Mã bệnh nhân: ${patient.code}
      - Họ tên: ${patient.name}
      - Tuổi: ${patient.age}
      - Giới tính: ${patient.gender}
      - Số điện thoại: ${patient.phone}
      - Địa chỉ: ${patient.address}
      - Bác sĩ phụ trách: ${patient.assignedDoctor}
      - Ngày phân công: ${patient.assignedDate}
      - Lần khám gần nhất: ${patient.lastVisit}
      - Trạng thái: ${patient.status === 'active' ? 'Đang điều trị' : 'Ngưng điều trị'}
      
      LỊCH SỬ XÉT NGHIỆM VÀ KẾT QUẢ:
      ${patient.tests.map((test: any) => `
      ================================
      Mã xét nghiệm: ${test.code}
      Ngày thực hiện: ${test.date}
      Thời gian xét nghiệm: ${test.testDateTime}
      Thời gian chẩn đoán: ${test.diagnosisTime}
      Chẩn đoán: ${test.diagnosis}
      Điểm nguy cơ: ${test.riskScore}/100
      
      CHỈ SỐ SINH HỌC:
      ${Object.entries(test.biomarkers).map(([key, value]) => `      ${key.toUpperCase()}: ${value}`).join('\n')}
      
      KẾT LUẬN BÁC SĨ:
      ${test.doctorConclusion || 'Chưa có kết luận từ bác sĩ'}
      
      KHUYẾN NGHỊ:
      - Theo dõi định kỳ các chỉ số: ${Object.keys(test.biomarkers).join(', ')}
      - Tuân thủ chế độ điều trị đã được chỉ định
      - Tái khám theo lịch hẹn
      `).join('\n')}
      
      TỔNG KẾT VÀ KHUYẾN NGHỊ:
      - Tình trạng sức khỏe hiện tại: ${patient.tests.length > 0 ? patient.tests[0].diagnosis : 'Chưa có dữ liệu'}
      - Xu hướng: ${patient.tests.length > 1 ? 'Có dữ liệu theo dõi' : 'Cần thêm dữ liệu'}
      - Nguy cơ: ${patient.tests.length > 0 ? (patient.tests[0].riskScore > 70 ? 'Cao' : patient.tests[0].riskScore > 40 ? 'Trung bình' : 'Thấp') : 'Chưa đánh giá'}
      
      ==========================
      Báo cáo được tạo bởi: SLSS Gentis
      Ngày tạo: ${new Date().toLocaleString('vi-VN')}
      Người tạo: ${userRole === 'collaborator' ? 'Bác sĩ cộng tác' : 'Bác sĩ Gentis'}
      Ghi chú: Báo cáo này chỉ có giá trị tham khảo, cần kết hợp với khám lâm sàng
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BaoCao_${patient.code}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Tải xuống thành công",
      description: `Báo cáo chi tiết bệnh nhân ${patient.name} đã được tải xuống`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Patient Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="font-medium text-slate-600 w-32">Mã bệnh nhân:</span>
                <span className="font-mono text-red-600 font-medium">{patient.code}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-slate-600 w-32">Họ tên:</span>
                <span className="font-medium">{patient.name}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-slate-600 w-32">Tuổi:</span>
                <span>{patient.age}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-slate-600 w-32">Giới tính:</span>
                <span>{patient.gender}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium text-slate-600 w-32">Số điện thoại:</span>
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium text-slate-600 w-32">Địa chỉ:</span>
                <span>{patient.address}</span>
              </div>
              <div className="flex items-center">
                <Stethoscope className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium text-slate-600 w-32">Bác sĩ phụ trách:</span>
                <span>{patient.assignedDoctor}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium text-slate-600 w-32">Lần khám cuối:</span>
                <span>{patient.lastVisit}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-medium text-slate-600 mr-2">Trạng thái:</span>
                <Badge variant={patient.status === 'active' ? "default" : "secondary"}>
                  {patient.status === 'active' ? 'Đang điều trị' : 'Ngưng điều trị'}
                </Badge>
              </div>
              <Button onClick={handleDownloadReport} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Tải báo cáo chi tiết
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Kết quả xét nghiệm và chẩn đoán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {patient.tests.map((test, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{test.code}</h3>
                    <p className="text-sm text-slate-600">
                      Ngày: {test.date} | Thời gian xét nghiệm: {test.testDateTime}
                    </p>
                    <p className="text-sm text-slate-600">
                      Thời gian chẩn đoán: {test.diagnosisTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">{test.riskScore}/100</div>
                    <div className="text-sm text-slate-600">Điểm nguy cơ</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <h4 className="font-medium text-blue-800 mb-1">Chẩn đoán:</h4>
                  <p className="text-blue-700">{test.diagnosis}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Chỉ số sinh học:</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Chỉ số</TableHead>
                        <TableHead>Kết quả</TableHead>
                        <TableHead>Đánh giá</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(test.biomarkers).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium">{key.toUpperCase()}</TableCell>
                          <TableCell>{value as string}</TableCell>
                          <TableCell>
                            <Badge variant={
                              (key === 'glucose' && (value as number) > 140) ||
                              (key === 'hba1c' && (value as number) > 6.5) ||
                              (key === 'cholesterol' && (value as number) > 200)
                                ? "destructive" : "secondary"
                            }>
                              {(key === 'glucose' && (value as number) > 140) ||
                               (key === 'hba1c' && (value as number) > 6.5) ||
                               (key === 'cholesterol' && (value as number) > 200)
                                ? "Cao" : "Bình thường"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {test.doctorConclusion && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-1">Kết luận bác sĩ:</h4>
                    <p className="text-green-700">{test.doctorConclusion}</p>
                  </div>
                )}

                {!test.doctorConclusion && !isCollaborator && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      Chưa có kết luận từ bác sĩ. Vui lòng cập nhật kết luận cho bệnh nhân này.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
