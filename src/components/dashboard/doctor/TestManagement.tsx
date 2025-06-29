
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Calendar,
  User,
  TestTube,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestManagementProps {
  userRole?: string;
}

export const TestManagement = ({ userRole }: TestManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const { toast } = useToast();

  // Filter tests based on user role
  const allTests = [
    {
      id: 1,
      code: 'XN_240115_001',
      patientName: 'Nguyễn Văn A',
      patientCode: 'PT001',
      testDate: '2024-01-15',
      testTime: '09:30:45',
      status: 'completed',
      assignedDoctor: 'BS. Trần Văn B',
      diagnosis: 'Tiểu đường type 2',
      riskScore: 85,
      priority: 'high'
    },
    {
      id: 2,
      code: 'XN_240114_002',
      patientName: 'Trần Thị B',
      patientCode: 'PT002',
      testDate: '2024-01-14',
      testTime: '14:20:18',
      status: 'pending',
      assignedDoctor: 'BS. Nguyễn Thị C',
      diagnosis: '',
      riskScore: 0,
      priority: 'medium'
    },
    {
      id: 3,
      code: 'XN_240113_003',
      patientName: 'Lê Văn C',
      patientCode: 'PT003',
      testDate: '2024-01-13',
      testTime: '11:15:30',
      status: 'completed',
      assignedDoctor: 'BS. Trần Văn B',
      diagnosis: 'Rối loạn lipid máu',
      riskScore: 65,
      priority: 'low'
    }
  ];

  // Filter tests for collaborator - only show tests assigned to them
  const tests = userRole === 'collaborator' 
    ? allTests.filter(test => test.assignedDoctor === 'BS. Trần Văn B') // Assuming current collaborator
    : allTests;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Hoàn thành</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Đang xử lý</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Thất bại</Badge>;
      default:
        return <Badge variant="secondary">Chưa xác định</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Cao</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Trung bình</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Thấp</Badge>;
      default:
        return <Badge variant="secondary">Bình thường</Badge>;
    }
  };

  const handleExportReport = (test: any) => {
    const reportContent = `
      BÁO CÁO XÉT NGHIỆM CHI TIẾT
      ===========================
      
      THÔNG TIN XÉT NGHIỆM:
      - Mã xét nghiệm: ${test.code}
      - Ngày xét nghiệm: ${test.testDate}
      - Thời gian: ${test.testTime}
      - Trạng thái: ${test.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
      - Mức độ ưu tiên: ${test.priority}
      
      THÔNG TIN BỆNH NHÂN:
      - Tên bệnh nhân: ${test.patientName}
      - Mã bệnh nhân: ${test.patientCode}
      
      THÔNG TIN BÁC SĨ:
      - Bác sĩ phụ trách: ${test.assignedDoctor}
      
      KẾT QUẢ CHẨN ĐOÁN:
      - Chẩn đoán: ${test.diagnosis || 'Chưa có kết quả'}
      - Điểm nguy cơ: ${test.riskScore}/100
      
      CHỈ SỐ SINH HỌC CHI TIẾT:
      - Glucose: 180 mg/dL (Cao)
      - HbA1c: 8.5% (Cao)
      - Cholesterol: 240 mg/dL (Cao)
      - Triglycerides: 220 mg/dL (Cao)
      - HDL: 35 mg/dL (Thấp)
      - LDL: 160 mg/dL (Cao)
      
      ĐÁNH GIÁ TỔNG QUAN:
      ${test.diagnosis ? `Bệnh nhân được chẩn đoán ${test.diagnosis} với điểm nguy cơ ${test.riskScore}/100.` : 'Chưa có đánh giá từ bác sĩ.'}
      
      KHUYẾN NGHỊ:
      - Theo dõi thường xuyên các chỉ số sinh học
      - Tuân thủ chế độ ăn uống và tập luyện
      - Tái khám theo lịch hẹn
      
      ===========================
      Báo cáo được tạo bởi SLSS Gentis
      Ngày tạo: ${new Date().toLocaleString('vi-VN')}
      Người tạo: ${userRole === 'collaborator' ? 'Bác sĩ Cộng tác' : 'Bác sĩ'}
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
      title: "Xuất báo cáo thành công",
      description: `Báo cáo xét nghiệm ${test.code} đã được tải xuống`,
    });
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.patientCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Quản lý xét nghiệm
          {userRole === 'collaborator' && <span className="text-sm font-normal text-slate-600 ml-2">(Chỉ xét nghiệm được phân công)</span>}
        </h2>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm theo mã XN, tên bệnh nhân..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="pending">Đang xử lý</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách xét nghiệm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã xét nghiệm</TableHead>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Ngày xét nghiệm</TableHead>
                <TableHead>Bác sĩ phụ trách</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Mức độ ưu tiên</TableHead>
                <TableHead>Thao tác</TableHead>
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
                    <div>
                      <p>{test.testDate}</p>
                      <p className="text-sm text-slate-600">{test.testTime}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{test.assignedDoctor}</TableCell>
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
                  <TableCell>{getPriorityBadge(test.priority)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedTest(test)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Chi tiết
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleExportReport(test)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Xuất báo cáo
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
                <div className="bg-slate-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <TestTube className="h-4 w-4 mr-2" />
                    Thông tin xét nghiệm
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Mã:</strong> {selectedTest.code}</p>
                    <p><strong>Ngày:</strong> {selectedTest.testDate}</p>
                    <p><strong>Thời gian:</strong> {selectedTest.testTime}</p>
                    <p><strong>Trạng thái:</strong> {getStatusBadge(selectedTest.status)}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Thông tin bệnh nhân
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Tên:</strong> {selectedTest.patientName}</p>
                    <p><strong>Mã BN:</strong> {selectedTest.patientCode}</p>
                    <p><strong>Bác sĩ:</strong> {selectedTest.assignedDoctor}</p>
                    <p><strong>Ưu tiên:</strong> {getPriorityBadge(selectedTest.priority)}</p>
                  </div>
                </div>
              </div>

              {selectedTest.diagnosis && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Kết quả chẩn đoán</h4>
                  <p className="text-sm"><strong>Chẩn đoán:</strong> {selectedTest.diagnosis}</p>
                  <p className="text-sm"><strong>Điểm nguy cơ:</strong> {selectedTest.riskScore}/100</p>
                </div>
              )}

              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2">Lưu ý quan trọng</h4>
                <p className="text-sm text-yellow-700">
                  • Chi tiết đầy đủ về chỉ số sinh học và kết quả phân tích có trong báo cáo xuất ra.<br/>
                  • Để xem thông tin chi tiết, vui lòng xuất báo cáo xét nghiệm.<br/>
                  • Thông tin hiển thị ở đây chỉ mang tính chất tham khảo.
                </p>
              </div>

              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    handleExportReport(selectedTest);
                    setSelectedTest(null);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Xuất báo cáo chi tiết
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
