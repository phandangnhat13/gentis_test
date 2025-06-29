import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  TestTube, 
  Calendar,
  FileText,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestManagementProps {
  userRole: string;
}

export const TestManagement = ({ userRole }: TestManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [editingTest, setEditingTest] = useState<any>(null);
  const { toast } = useToast();

  // Filter tests based on user role - collaborators only see their assigned patients
  const [tests] = useState([
    {
      id: 1,
      code: 'XN_240115_001',
      patientName: 'Nguyễn Văn A',
      patientCode: 'PT001',
      testDate: '2024-01-15',
      sampleType: 'Máu',
      status: 'pending',
      assignedDoctor: 'BS. Trần Văn B',
      notes: 'Xét nghiệm định kỳ'
    },
    {
      id: 2,
      code: 'XN_240114_002',
      patientName: 'Trần Thị B',
      patientCode: 'PT002',
      testDate: '2024-01-14',
      sampleType: 'Nước tiểu',
      status: 'completed',
      assignedDoctor: 'BS. Nguyễn Thị C',
      notes: 'Kiểm tra sau điều trị'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>;
      case 'completed':
        return <Badge variant="default">Hoàn thành</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Đang xử lý</Badge>;
      default:
        return <Badge variant="secondary">Chưa xác định</Badge>;
    }
  };

  const handleSaveTest = (testData: any) => {
    console.log('Saving test:', testData);
    toast({
      title: "Lưu thành công",
      description: `Xét nghiệm ${testData.code} đã được cập nhật`,
    });
    setEditingTest(null);
  };

  const filteredTests = tests.filter(test =>
    test.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.patientCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Quản lý xét nghiệm {userRole === 'collaborator' && '(Bệnh nhân được phân công)'}
        </h2>
        {userRole !== 'collaborator' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Thêm xét nghiệm mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm xét nghiệm mới</DialogTitle>
              </DialogHeader>
              <AddTestForm onAdd={() => {}} />
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
                <TableHead>Ngày thực hiện</TableHead>
                <TableHead>Loại mẫu</TableHead>
                <TableHead>Bác sĩ phụ trách</TableHead>
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
                  <TableCell>
                    <div className="flex items-center">
                      <TestTube className="h-4 w-4 mr-2 text-slate-400" />
                      {test.sampleType}
                    </div>
                  </TableCell>
                  <TableCell>{test.assignedDoctor}</TableCell>
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
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
                        onClick={() => setEditingTest(test)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Sửa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Test Dialog */}
      {selectedTest && (
        <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
          <DialogContent>
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
                  <label className="block text-sm font-medium text-slate-600">Loại mẫu</label>
                  <p className="font-medium">{selectedTest.sampleType}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600">Ghi chú</label>
                <p className="text-sm">{selectedTest.notes}</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => setSelectedTest(null)}
                className="w-full"
              >
                Đóng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Test Dialog */}
      {editingTest && (
        <Dialog open={!!editingTest} onOpenChange={() => setEditingTest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa xét nghiệm</DialogTitle>
            </DialogHeader>
            <EditTestForm 
              test={editingTest} 
              onSave={handleSaveTest}
              onCancel={() => setEditingTest(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const AddTestForm = ({ onAdd }: { onAdd: (test: any) => void }) => {
  const [formData, setFormData] = useState({
    patientCode: '',
    sampleType: '',
    notes: ''
  });

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="patientCode">Mã bệnh nhân</Label>
        <Input
          id="patientCode"
          value={formData.patientCode}
          onChange={(e) => setFormData({...formData, patientCode: e.target.value})}
          placeholder="Nhập mã bệnh nhân"
        />
      </div>
      <div>
        <Label htmlFor="sampleType">Loại mẫu</Label>
        <Input
          id="sampleType"
          value={formData.sampleType}
          onChange={(e) => setFormData({...formData, sampleType: e.target.value})}
          placeholder="Máu, Nước tiểu, v.v."
        />
      </div>
      <div>
        <Label htmlFor="notes">Ghi chú</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Ghi chú về xét nghiệm"
        />
      </div>
      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700"
        onClick={() => onAdd(formData)}
      >
        Thêm xét nghiệm
      </Button>
    </div>
  );
};

const EditTestForm = ({ 
  test, 
  onSave, 
  onCancel 
}: { 
  test: any; 
  onSave: (test: any) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState(test);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="sampleType">Loại mẫu</Label>
        <Input
          id="sampleType"
          value={formData.sampleType}
          onChange={(e) => setFormData({...formData, sampleType: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="notes">Ghi chú</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
        />
      </div>
      <div className="flex space-x-2">
        <Button 
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={() => onSave(formData)}
        >
          <Save className="h-4 w-4 mr-2" />
          Lưu
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          <X className="h-4 w-4 mr-2" />
          Hủy
        </Button>
      </div>
    </div>
  );
};
