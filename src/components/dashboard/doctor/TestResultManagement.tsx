
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Download,
  Eye,
  Activity,
  FileText,
  Info
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
import { TestResultDetails } from './TestResultDetails';

interface TestResultManagementProps {
  userRole: string;
}

export const TestResultManagement = ({ userRole }: TestResultManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const isCollaborator = userRole === 'collaborator';
  const { toast } = useToast();

  const [testResults] = useState([
    {
      id: 1,
      testCode: 'XN_240115_001',
      patientName: 'Nguyễn Văn A',
      birthDate: '1979-05-15',
      testDate: '2024-01-15',
      result: 'positive',
      phone: '0123456789',
      branch: 'Chi nhánh Hà Nội',
      analysisDate: '2024-01-15',
      accountCode: isCollaborator ? 'COL001' : 'GEN001',
      diagnosis: 'Tiểu đường type 2',
      diseaseCode: 'D001',
      biomarkers: {
        glucose: { value: 180, normal: '70-100', status: 'high', tier: 1 },
        hba1c: { value: 8.5, normal: '4-6', status: 'high', tier: 1 },
        cholesterol: { value: 240, normal: '<200', status: 'high', tier: 2 }
      },
      doctorConclusion: 'Bệnh nhân cần điều chỉnh chế độ ăn uống và dùng thuốc theo chỉ định'
    },
    {
      id: 2,
      testCode: 'XN_240114_002',
      patientName: 'Trần Thị B',
      birthDate: '1986-03-22',
      testDate: '2024-01-14',
      result: 'positive',
      phone: '0987654321',
      branch: 'Chi nhánh TP.HCM',
      analysisDate: '2024-01-14',
      accountCode: isCollaborator ? 'COL001' : 'GEN001',
      diagnosis: 'Rối loạn lipid máu',
      diseaseCode: 'D002',
      biomarkers: {
        totalCholesterol: { value: 220, normal: '<200', status: 'high', tier: 2 },
        ldl: { value: 140, normal: '<100', status: 'high', tier: 1 },
        hdl: { value: 45, normal: '>40', status: 'normal', tier: 2 }
      },
      doctorConclusion: 'Bệnh nhân cần điều chỉnh chế độ ăn uống và tăng cường vận động'
    },
    {
      id: 3,
      testCode: 'XN_240113_003',
      patientName: 'Lê Văn C',
      birthDate: '1992-11-08',
      testDate: '2024-01-13',
      result: 'negative',
      phone: '0912345678',
      branch: 'Chi nhánh Đà Nẵng',
      analysisDate: '2024-01-13',
      accountCode: isCollaborator ? 'COL001' : 'GEN001',
      diagnosis: 'Bình thường',
      diseaseCode: null,
      biomarkers: {
        glucose: { value: 95, normal: '70-100', status: 'normal', tier: 1 },
        cholesterol: { value: 185, normal: '<200', status: 'normal', tier: 2 }
      },
      doctorConclusion: ''
    }
  ]);

  const handleReAnalyze = (testResult: any) => {
    toast({
      title: "Phân tích lại",
      description: `Đang phân tích lại xét nghiệm ${testResult.testCode}`,
    });
    console.log('Re-analyzing test:', testResult.testCode);
  };

  const handleDownloadDetails = (testResult: any) => {
    const reportContent = `
      BÁO CÁO KẾT QUẢ XÉT NGHIỆM
      ===========================
      
      THÔNG TIN XÉT NGHIỆM:
      - Mã xét nghiệm: ${testResult.testCode}
      - Họ tên: ${testResult.patientName}
      - Ngày sinh: ${testResult.birthDate}
      - Số điện thoại: ${testResult.phone}
      - Chi nhánh: ${testResult.branch}
      - Ngày xét nghiệm: ${testResult.testDate}
      - Ngày phân tích: ${testResult.analysisDate}
      
      KẾT QUẢ:
      - Kết quả: ${testResult.result === 'positive' ? 'Dương tính' : 'Âm tính'}
      - Chẩn đoán: ${testResult.diagnosis}
      
      CHỈ SỐ SINH HỌC:
      ${Object.entries(testResult.biomarkers).map(([key, marker]: [string, any]) => 
        `- ${key.toUpperCase()}: ${marker.value} (BT: ${marker.normal}) - ${marker.status === 'high' ? 'Cao' : marker.status === 'low' ? 'Thấp' : 'Bình thường'}`
      ).join('\n      ')}
      
      KẾT LUẬN BÁC SĨ:
      ${testResult.doctorConclusion || 'Chưa có kết luận'}
      
      ===========================
      Báo cáo được tạo bởi SLSS Gentis
      Ngày tạo: ${new Date().toLocaleString('vi-VN')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BaoCao_${testResult.testCode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Tải xuống thành công",
      description: `Báo cáo xét nghiệm ${testResult.testCode} đã được tải xuống`,
    });
  };

  const handleViewTestDetails = (testResult: any) => {
    setSelectedTest(testResult);
  };

  // Filter test results by account code for collaborators
  const filteredTestResults = testResults.filter(test => {
    const matchesSearch = test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For collaborators, only show tests with their account code
    if (isCollaborator) {
      return matchesSearch && test.accountCode === 'COL001';
    }
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý xét nghiệm</h2>
          {isCollaborator && (
            <p className="text-sm text-slate-600 mt-1">
              Hiển thị xét nghiệm được phân công cho tài khoản: COL001
            </p>
          )}
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã xét nghiệm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách xét nghiệm
            {isCollaborator && (
              <Badge variant="outline" className="ml-2">
                {filteredTestResults.length} xét nghiệm được phân công
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã XN</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Ngày XN</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Chi nhánh</TableHead>
                <TableHead>Ngày phân tích</TableHead>
                <TableHead>Phân tích lại</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestResults.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-mono text-sm">{test.testCode}</TableCell>
                  <TableCell className="font-medium">{test.patientName}</TableCell>
                  <TableCell>{test.birthDate}</TableCell>
                  <TableCell>{test.testDate}</TableCell>
                  <TableCell>
                    <Badge variant={test.result === 'positive' ? "destructive" : "secondary"}>
                      {test.result === 'positive' ? 'Dương tính' : 'Âm tính'}
                    </Badge>
                  </TableCell>
                  <TableCell>{test.phone}</TableCell>
                  <TableCell>{test.branch}</TableCell>
                  <TableCell>{test.analysisDate}</TableCell>
                  <TableCell>
                    {!isCollaborator && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReAnalyze(test)}
                      >
                        <Activity className="h-3 w-3 mr-1" />
                        Phân tích lại
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewTestDetails(test)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Xem
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadDetails(test)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Tải
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Test Result Details Dialog */}
      {selectedTest && (
        <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Chi tiết xét nghiệm: {selectedTest.testCode} - {selectedTest.patientName}
              </DialogTitle>
            </DialogHeader>
            <TestResultDetails testResult={selectedTest} userRole={userRole} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
