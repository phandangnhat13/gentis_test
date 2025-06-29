
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Download, FileText, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestAnalysisProps {
  userRole: string;
}

export const TestAnalysis = ({ userRole }: TestAnalysisProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const { toast } = useToast();

  const [tests] = useState([
    {
      id: 1,
      code: 'XN_240115_001',
      patientName: 'Nguyễn Văn A',
      patientCode: 'PT001',
      testDate: '2024-01-15',
      diagnosis: 'Tiểu đường type 2',
      riskScore: 85,
      status: 'completed',
      biomarkers: {
        glucose: 180,
        hba1c: 8.5,
        cholesterol: 240,
        triglycerides: 150
      }
    },
    {
      id: 2,
      code: 'XN_240114_002',
      patientName: 'Trần Thị B',
      patientCode: 'PT002',
      testDate: '2024-01-14',
      diagnosis: 'Rối loạn lipid máu',
      riskScore: 65,
      status: 'completed',
      biomarkers: {
        totalCholesterol: 220,
        ldl: 140,
        hdl: 45,
        triglycerides: 200
      }
    }
  ]);

  const getRiskBadge = (score: number) => {
    if (score >= 80) return <Badge variant="destructive">Nguy cơ cao</Badge>;
    if (score >= 60) return <Badge className="bg-orange-100 text-orange-800">Nguy cơ trung bình</Badge>;
    return <Badge className="bg-green-100 text-green-800">Nguy cơ thấp</Badge>;
  };

  const handleDownloadReport = (test: any) => {
    const reportContent = `
      BÁO CÁO KẾT QUẢ XÉT NGHIỆM
      ===========================
      
      Mã xét nghiệm: ${test.code}
      Bệnh nhân: ${test.patientName} (${test.patientCode})
      Ngày xét nghiệm: ${test.testDate}
      
      KẾT QUẢ CHẨN ĐOÁN:
      - Chẩn đoán: ${test.diagnosis}
      - Điểm nguy cơ: ${test.riskScore}/100
      
      CHỈ SỐ SINH HỌC:
      ${Object.entries(test.biomarkers).map(([key, value]) => `- ${key.toUpperCase()}: ${value}`).join('\n      ')}
      
      NHẬN XÉT:
      ${test.riskScore >= 80 ? 'Bệnh nhân có nguy cơ cao, cần theo dõi sát và điều trị tích cực.' : 
        test.riskScore >= 60 ? 'Bệnh nhân có nguy cơ trung bình, cần theo dõi định kỳ.' : 
        'Bệnh nhân có nguy cơ thấp, duy trì lối sống lành mạnh.'}
      
      ===========================
      Báo cáo được tạo bởi SLSS Gentis
      Ngày tạo: ${new Date().toLocaleString('vi-VN')}
      Bác sĩ phụ trách: ${userRole === 'collaborator' ? 'Bác sĩ cộng tác' : 'Bác sĩ chính'}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BaoCaoXetNghiem_${test.code}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Tải xuống thành công",
      description: `Báo cáo xét nghiệm ${test.code} đã được tải xuống`,
    });
  };

  const filteredTests = tests.filter(test =>
    test.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.patientCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Phân tích số liệu</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo mã xét nghiệm, tên bệnh nhân..."
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
                <TableHead>Mã xét nghiệm</TableHead>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Ngày xét nghiệm</TableHead>
                <TableHead>Chẩn đoán</TableHead>
                <TableHead>Mức độ nguy cơ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.code}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{test.patientName}</p>
                      <p className="text-sm text-slate-600">{test.patientCode}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                      {test.testDate}
                    </div>
                  </TableCell>
                  <TableCell>{test.diagnosis}</TableCell>
                  <TableCell>{getRiskBadge(test.riskScore)}</TableCell>
                  <TableCell>
                    <Badge variant="default">
                      {test.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex space-x-2 justify-end">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedTest(test)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Xem
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadReport(test)}
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

      {/* Test Detail Dialog */}
      {selectedTest && (
        <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết xét nghiệm - {selectedTest.code}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600">Mã xét nghiệm</label>
                  <p className="font-medium">{selectedTest.code}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600">Ngày thực hiện</label>
                  <p className="font-medium">{selectedTest.testDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600">Bệnh nhân</label>
                  <p className="font-medium">{selectedTest.patientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600">Mã bệnh nhân</label>
                  <p className="font-medium">{selectedTest.patientCode}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600">Kết quả chẩn đoán</label>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-blue-800">{selectedTest.diagnosis}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-blue-600 mr-2">Điểm nguy cơ:</span>
                    {getRiskBadge(selectedTest.riskScore)}
                    <span className="ml-2 font-medium">{selectedTest.riskScore}/100</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600">Chỉ số sinh học</label>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(selectedTest.biomarkers).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span className="font-medium">{key.toUpperCase()}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    handleDownloadReport(selectedTest);
                    setSelectedTest(null);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Tải báo cáo chi tiết
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedTest(null)}
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
