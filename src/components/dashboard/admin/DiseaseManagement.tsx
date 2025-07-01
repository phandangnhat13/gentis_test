
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText, Search, Upload, Edit, Eye, Save, X, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Disease {
  id: number;
  name: string;
  code: string;
  category: string;
  classification: string;
  hasDescription: boolean;
  hasSummary: boolean;
  relatedTests: string[];
  riskFactors: number;
  description?: string;
  summary?: string;
}

const diseaseClassifications = [
  'Bệnh tim mạch',
  'Bệnh nội tiết',
  'Bệnh chuyển hóa',
  'Bệnh gan',
  'Bệnh thận',
  'Bệnh máu',
  'Bệnh phổi',
  'Bệnh tiêu hóa',
  'Bệnh thần kinh',
  'Bệnh ung thư'
];

export const DiseaseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassification, setSelectedClassification] = useState('all');
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);
  const [viewingDisease, setViewingDisease] = useState<Disease | null>(null);
  const { toast } = useToast();

  const [diseases, setDiseases] = useState<Disease[]>([
    {
      id: 1,
      name: 'Tiểu đường type 2',
      code: 'E11',
      category: 'Bệnh nội tiết',
      classification: 'Bệnh nội tiết',
      hasDescription: true,
      hasSummary: true,
      relatedTests: ['HbA1c', 'Glucose', 'Insulin'],
      riskFactors: 12,
      description: 'Tiểu đường type 2 là một rối loạn chuyển hóa mãn tính đặc trưng bởi tình trạng tăng đường huyết do sự kháng insulin và suy giảm chức năng tế bào beta tuyến tụy.',
      summary: 'Bệnh tiểu đường type 2 phổ biến ở người trưởng thành, có thể kiểm soát được bằng chế độ ăn, vận động và thuốc.'
    },
    {
      id: 2,
      name: 'Tăng huyết áp',
      code: 'I10',
      category: 'Bệnh tim mạch',
      classification: 'Bệnh tim mạch',
      hasDescription: true,
      hasSummary: false,
      relatedTests: ['Systolic BP', 'Diastolic BP'],
      riskFactors: 8,
      description: 'Tăng huyết áp là tình trạng áp lực máu trong động mach cao hơn bình thường (≥140/90 mmHg).'
    },
    {
      id: 3,
      name: 'Rối loạn lipid máu',
      code: 'E78',
      category: 'Bệnh chuyển hóa',
      classification: 'Bệnh chuyển hóa',
      hasDescription: false,
      hasSummary: true,
      relatedTests: ['Total Cholesterol', 'LDL', 'HDL', 'Triglycerides'],
      riskFactors: 15,
      summary: 'Rối loạn lipid máu bao gồm tăng cholesterol, LDL và giảm HDL, là yếu tố nguy cơ của bệnh tim mạch.'
    },
    {
      id: 4,
      name: 'Gan nhiễm mỡ',
      code: 'K76.0',
      category: 'Bệnh gan',
      classification: 'Bệnh gan',
      hasDescription: true,
      hasSummary: true,
      relatedTests: ['ALT', 'AST', 'GGT'],
      riskFactors: 10,
      description: 'Gan nhiễm mỡ là tình trạng tích tụ mỡ trong tế bào gan.',
      summary: 'Bệnh gan nhiễm mỡ có thể điều trị bằng thay đổi lối sống.'
    }
  ]);

  const handleAddDisease = (diseaseData: Partial<Disease>) => {
    const newDisease: Disease = {
      id: diseases.length + 1,
      name: diseaseData.name || '',
      code: diseaseData.code || '',
      category: diseaseData.category || '',
      classification: diseaseData.classification || '',
      hasDescription: false,
      hasSummary: false,
      relatedTests: [],
      riskFactors: 0,
      ...diseaseData
    };
    
    setDiseases([...diseases, newDisease]);
    toast({
      title: "Thêm bệnh mới",
      description: `Đã thêm bệnh ${newDisease.name} thành công`,
    });
  };

  const handleEditDisease = (disease: Disease) => {
    const updatedDiseases = diseases.map(d => 
      d.id === disease.id ? disease : d
    );
    setDiseases(updatedDiseases);
    setEditingDisease(null);
    
    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật thông tin bệnh ${disease.name}`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'csv' | 'description' | 'summary') => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`File ${type} đã chọn:`, file.name, file.size, file.type);
      
      if (type === 'csv') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          console.log('Nội dung CSV:', content.substring(0, 200) + '...');
          
          toast({
            title: "Upload thành công",
            description: `Đã tải lên file CSV: ${file.name}`,
          });
        };
        reader.readAsText(file);
      } else {
        toast({
          title: "Upload thành công",
          description: `Đã tải lên file ${type}: ${file.name}`,
        });
      }
    }
  };

  const filteredDiseases = diseases.filter(disease => {
    const matchesSearch = disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disease.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disease.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClassification = selectedClassification === 'all' || disease.classification === selectedClassification;
    
    return matchesSearch && matchesClassification;
  });

  const classificationCounts = diseaseClassifications.reduce((acc, classification) => {
    acc[classification] = diseases.filter(d => d.classification === classification).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý danh sách bệnh</h2>
        <div className="flex space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload file CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload file ma trận bệnh</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">Kéo thả file CSV hoặc click để chọn</p>
                  <p className="text-sm text-slate-500">File CSV chứa ma trận bệnh và chỉ số sinh học</p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileUpload(e, 'csv')}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload">
                    <Button className="mt-4" asChild>
                      <span>Chọn file CSV</span>
                    </Button>
                  </label>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Thêm bệnh mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm bệnh mới</DialogTitle>
              </DialogHeader>
              <AddDiseaseForm onAdd={handleAddDisease} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Classification Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Thống kê theo phân loại bệnh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {diseaseClassifications.map((classification) => (
              <div key={classification} className="bg-slate-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-slate-800">{classificationCounts[classification] || 0}</div>
                <div className="text-sm text-slate-600">{classification}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm bệnh theo tên, mã ICD hoặc danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedClassification} onValueChange={setSelectedClassification}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo phân loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phân loại</SelectItem>
                {diseaseClassifications.map((classification) => (
                  <SelectItem key={classification} value={classification}>
                    {classification} ({classificationCounts[classification] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên bệnh</TableHead>
                <TableHead>Mã ICD</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Phân loại</TableHead>
                <TableHead>Tài liệu</TableHead>
                <TableHead>Yếu tố nguy cơ</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDiseases.map((disease) => (
                <TableRow key={disease.id}>
                  <TableCell className="font-medium">{disease.name}</TableCell>
                  <TableCell>{disease.code}</TableCell>
                  <TableCell>{disease.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {disease.classification}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Badge variant={disease.hasDescription ? 'default' : 'secondary'} className="text-xs">
                        {disease.hasDescription ? 'Mô tả' : 'Chưa có mô tả'}
                      </Badge>
                      <Badge variant={disease.hasSummary ? 'default' : 'secondary'} className="text-xs">
                        {disease.hasSummary ? 'Tóm tắt' : 'Chưa có tóm tắt'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-red-600 font-medium">{disease.riskFactors}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setEditingDisease(disease)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Sửa
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setViewingDisease(disease)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Xem
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Disease Dialog */}
      {editingDisease && (
        <Dialog open={!!editingDisease} onOpenChange={() => setEditingDisease(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin bệnh</DialogTitle>
            </DialogHeader>
            <EditDiseaseForm 
              disease={editingDisease} 
              onSave={handleEditDisease}
              onCancel={() => setEditingDisease(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* View Disease Dialog */}
      {viewingDisease && (
        <Dialog open={!!viewingDisease} onOpenChange={() => setViewingDisease(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thông tin chi tiết: {viewingDisease.name}</DialogTitle>
            </DialogHeader>
            <ViewDiseaseDetails disease={viewingDisease} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Add Disease Form Component
const AddDiseaseForm = ({ onAdd }: { onAdd: (disease: Partial<Disease>) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    classification: '',
    description: '',
    summary: ''
  });

  const handleSubmit = () => {
    if (formData.name && formData.code && formData.category && formData.classification) {
      onAdd({
        ...formData,
        hasDescription: !!formData.description,
        hasSummary: !!formData.summary,
        relatedTests: [],
        riskFactors: 0
      });
      setFormData({ name: '', code: '', category: '', classification: '', description: '', summary: '' });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tên bệnh</label>
        <Input 
          placeholder="Nhập tên bệnh" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mã ICD</label>
        <Input 
          placeholder="Nhập mã ICD" 
          value={formData.code}
          onChange={(e) => setFormData({...formData, code: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Danh mục</label>
        <Input 
          placeholder="Nhập danh mục bệnh" 
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phân loại bệnh</label>
        <Select value={formData.classification} onValueChange={(value) => setFormData({...formData, classification: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn phân loại bệnh" />
          </SelectTrigger>
          <SelectContent>
            {diseaseClassifications.map((classification) => (
              <SelectItem key={classification} value={classification}>
                {classification}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mô tả bệnh (tùy chọn)</label>
        <Textarea 
          placeholder="Nhập mô tả chi tiết về bệnh" 
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tóm tắt bệnh (tùy chọn)</label>
        <Textarea 
          placeholder="Nhập tóm tắt ngắn gọn về bệnh" 
          value={formData.summary}
          onChange={(e) => setFormData({...formData, summary: e.target.value})}
        />
      </div>
      <Button 
        className="w-full bg-red-600 hover:bg-red-700"
        onClick={handleSubmit}
        disabled={!formData.name || !formData.code || !formData.category || !formData.classification}
      >
        Thêm bệnh
      </Button>
    </div>
  );
};

// Edit Disease Form Component
const EditDiseaseForm = ({ 
  disease, 
  onSave, 
  onCancel 
}: { 
  disease: Disease; 
  onSave: (disease: Disease) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState(disease);

  const handleSave = () => {
    onSave({
      ...formData,
      hasDescription: !!formData.description,
      hasSummary: !!formData.summary
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tên bệnh</label>
        <Input 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mã ICD</label>
        <Input 
          value={formData.code}
          onChange={(e) => setFormData({...formData, code: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Danh mục</label>
        <Input 
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phân loại bệnh</label>
        <Select value={formData.classification} onValueChange={(value) => setFormData({...formData, classification: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn phân loại bệnh" />
          </SelectTrigger>
          <SelectContent>
            {diseaseClassifications.map((classification) => (
              <SelectItem key={classification} value={classification}>
                {classification}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mô tả bệnh</label>
        <Textarea 
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tóm tắt bệnh</label>
        <Textarea 
          value={formData.summary || ''}
          onChange={(e) => setFormData({...formData, summary: e.target.value})}
        />
      </div>
      <div className="flex space-x-2">
        <Button 
          className="flex-1 bg-red-600 hover:bg-red-700"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Lưu thay đổi
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

// View Disease Details Component
const ViewDiseaseDetails = ({ disease }: { disease: Disease }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600">Tên bệnh</label>
          <p className="font-medium">{disease.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600">Mã ICD</label>
          <p className="font-medium">{disease.code}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600">Danh mục</label>
          <p className="font-medium">{disease.category}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600">Phân loại</label>
          <Badge variant="outline">{disease.classification}</Badge>
        </div>
      </div>

      {disease.description && (
        <div>
          <label className="block text-sm font-medium text-slate-600">Mô tả chi tiết</label>
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-sm">{disease.description}</p>
          </div>
        </div>
      )}

      {disease.summary && (
        <div>
          <label className="block text-sm font-medium text-slate-600">Tóm tắt</label>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm">{disease.summary}</p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-600">Chỉ số sinh học liên quan</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {disease.relatedTests.map((test, index) => (
            <Badge key={index} variant="outline">{test}</Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600">Số yếu tố nguy cơ</label>
        <p className="font-medium text-red-600">{disease.riskFactors} yếu tố</p>
      </div>
    </div>
  );
};
