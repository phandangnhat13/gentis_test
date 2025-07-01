
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Download, FileText, Calendar, User, Phone, MapPin, Activity, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestResultDetailsProps {
  testResult: {
    id: number;
    testCode: string;
    patientName: string;
    birthDate: string;
    testDate: string;
    result: string;
    phone: string;
    branch: string;
    analysisDate: string;
    diagnosis: string;
    diseaseCode: string | null;
    biomarkers: any;
    doctorConclusion: string;
  };
  userRole: string;
}

export const TestResultDetails = ({ testResult, userRole }: TestResultDetailsProps) => {
  const [showConclusionDialog, setShowConclusionDialog] = useState(false);
  const [conclusion, setConclusion] = useState(testResult.doctorConclusion);
  const [showDiseaseDialog, setShowDiseaseDialog] = useState(false);
  const [diseaseViewType, setDiseaseViewType] = useState<'detail' | 'summary'>('detail');
  const { toast } = useToast();
  const isCollaborator = userRole === 'collaborator';

  // Mock disease data
  const diseaseInfo = {
    D001: {
      name: 'Tiểu đường type 2',
      description: 'Bệnh tiểu đường type 2 là một rối loạn chuyển hóa mãn tính...',
      symptoms: ['Khát nước nhiều', 'Tiểu nhiều', 'Mệt mỏi', 'Sụt cân'],
      diagnosis: 'Dựa vào xét nghiệm glucose máu đói, HbA1c...',
      treatment: 'Điều chỉnh chế độ ăn uống, tập thể dục, dùng thuốc...',
      summary: 'Bệnh tiểu đường type 2 gây ra do tế bào kháng insulin hoặc tuyến tụy không sản xuất đủ insulin.'
    },
    D002: {
      name: 'Rối loạn lipid máu',
      description: 'Rối loạn lipid máu là tình trạng bất thường trong nồng độ lipid...',
      symptoms: ['Thường không có triệu chứng', 'Có thể đau ngực'],
      diagnosis: 'Xét nghiệm lipid máu, cholesterol total, LDL, HDL...',
      treatment: 'Thay đổi lối sống, thuốc hạ lipid máu...',
      summary: 'Rối loạn lipid máu tăng nguy cơ bệnh tim mạch, cần kiểm soát chế độ ăn và dùng thuốc.'
    }
  };

  const handleSaveConclusion = () => {
    toast({
      title: "Lưu kết luận thành công",
      description: "Kết luận của bác sĩ đã được cập nhật",
    });
    setShowConclusionDialog(false);
  };

  const handleReAnalyze = () => {
    toast({
      title: "Phân tích lại",
      description: `Đang phân tích lại xét nghiệm ${testResult.testCode}`,
    });
  };

  const handleDownloadReport = () => {
    const reportContent = `
      BÁO CÁO XÉT NGHIỆM CHI TIẾT
      ============================
      
      THÔNG TIN XÉT NGHIỆM:
      - Mã xét nghiệm: ${testResult.testCode}
      - Họ tên: ${testResult.patientName}
      - Ngày sinh: ${testResult.birthDate}
      - Số điện thoại: ${testResult.phone}
      - Chi nhánh: ${testResult.branch}
      - Ngày xét nghiệm: ${testResult.testDate}
      - Ngày phân tích: ${testResult.analysisDate}
      
      KẾT QUẢ VÀ CHẨN ĐOÁN:
      - Kết quả: ${testResult.result === 'positive' ? 'Dương tính' : 'Âm tính'}
      - Chẩn đoán: ${testResult.diagnosis}
      
      CHỈ SỐ SINH HỌC CHI TIẾT:
      ${Object.entries(testResult.biomarkers).map(([key, marker]: [string, any]) => 
        `- ${key.toUpperCase()}: ${marker.value} (Khoảng bình thường: ${marker.normal})
          Nhận định: ${marker.status === 'high' ? 'Tăng' : marker.status === 'low' ? 'Giảm' : 'Trong ngưỡng'}`
      ).join('\n      ')}
      
      KẾT LUẬN BÁC SĨ:
      ${testResult.doctorConclusion || 'Chưa có kết luận từ bác sĩ'}
      
      ============================
      Báo cáo được tạo bởi: SLSS Gentis
      Ngày tạo: ${new Date().toLocaleString('vi-VN')}
      Bác sĩ: ${userRole === 'collaborator' ? 'Bác sĩ cộng tác' : 'Bác sĩ'}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BaoCao_ChiTiet_${testResult.testCode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Tải xuống thành công",
      description: `Báo cáo chi tiết ${testResult.testCode} đã được tải xuống`,
    });
  };

  const disease = testResult.diseaseCode ? diseaseInfo[testResult.diseaseCode as keyof typeof diseaseInfo] : null;

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Thông tin xét nghiệm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="font-medium text-slate-600 w-32">Mã xét nghiệm:</span>
                <span className="font-mono text-red-600 font-medium">{testResult.testCode}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-slate-600 w-32">Họ tên:</span>
                <span className="font-medium">{testResult.patientName}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-slate-600 w-32">Ngày sinh:</span>
                <span>{testResult.birthDate}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium text-slate-600 w-32">Số điện thoại:</span>
                <span>{testResult.phone}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium text-slate-600 w-32">Chi nhánh:</span>
                <span>{testResult.branch}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium text-slate-600 w-32">Ngày xét nghiệm:</span>
                <span>{testResult.testDate}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium text-slate-600 w-32">Ngày phân tích:</span>
                <span>{testResult.analysisDate}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-slate-600 w-32">Kết quả:</span>
                <Badge variant={testResult.result === 'positive' ? "destructive" : "secondary"}>
                  {testResult.result === 'positive' ? 'Dương tính' : 'Âm tính'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <div className="flex space-x-2">
              {!isCollaborator && (
                <Button onClick={handleReAnalyze} variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Phân tích lại
                </Button>
              )}
              {!isCollaborator && (
                <Button onClick={() => setShowConclusionDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  {testResult.doctorConclusion ? 'Sửa kết luận' : 'Nhập kết luận'}
                </Button>
              )}
            </div>
            <Button onClick={handleDownloadReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Tải báo cáo chi tiết
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results and Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Kết quả xét nghiệm và chẩn đoán
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Chẩn đoán:</h3>
                <p className="text-blue-700 text-lg">{testResult.diagnosis}</p>
              </div>
              {disease && (
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setDiseaseViewType('detail');
                      setShowDiseaseDialog(true);
                    }}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Chi tiết
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setDiseaseViewType('summary');
                      setShowDiseaseDialog(true);
                    }}
                  >
                    <Info className="h-3 w-3 mr-1" />
                    Tóm tắt
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Biomarkers Table */}
          <div>
            <h4 className="font-medium mb-3">Chi tiết chỉ số sinh học:</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chỉ số</TableHead>
                  <TableHead>Kết quả</TableHead>
                  <TableHead>Khoảng tham chiếu</TableHead>
                  <TableHead>Nhận định</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(testResult.biomarkers).map(([key, marker]: [string, any]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{key.toUpperCase()}</TableCell>
                    <TableCell className="font-semibold">{marker.value}</TableCell>
                    <TableCell className="text-slate-600">{marker.normal}</TableCell>
                    <TableCell>
                      <Badge variant={
                        marker.status === 'high' ? "destructive" : 
                        marker.status === 'low' ? "secondary" : "outline"
                      }>
                        {marker.status === 'high' ? 'Tăng' : 
                         marker.status === 'low' ? 'Giảm' : 'Trong ngưỡng'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Doctor's Conclusion */}
          {testResult.doctorConclusion && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Kết luận bác sĩ:</h4>
              <p className="text-green-700">{testResult.doctorConclusion}</p>
            </div>
          )}

          {!testResult.doctorConclusion && !isCollaborator && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                Chưa có kết luận từ bác sĩ. Vui lòng nhập kết luận cho xét nghiệm này.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Doctor Conclusion Dialog */}
      {showConclusionDialog && (
        <Dialog open={showConclusionDialog} onOpenChange={setShowConclusionDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Kết luận cho xét nghiệm {testResult.testCode}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kết luận của bác sĩ:
                </label>
                <Textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="Nhập kết luận của bác sĩ..."
                  rows={4}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSaveConclusion}
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

      {/* Disease Info Dialog */}
      {disease && showDiseaseDialog && (
        <Dialog open={showDiseaseDialog} onOpenChange={setShowDiseaseDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {diseaseViewType === 'detail' ? 'Chi tiết' : 'Tóm tắt'}: {disease.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {diseaseViewType === 'detail' ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Mô tả:</h3>
                    <p className="text-slate-700">{disease.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Triệu chứng:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {disease.symptoms.map((symptom: string, index: number) => (
                        <li key={index} className="text-slate-700">{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Chẩn đoán:</h3>
                    <p className="text-slate-700">{disease.diagnosis}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Điều trị:</h3>
                    <p className="text-slate-700">{disease.treatment}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium mb-2">Tóm tắt:</h3>
                  <p className="text-slate-700">{disease.summary}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
