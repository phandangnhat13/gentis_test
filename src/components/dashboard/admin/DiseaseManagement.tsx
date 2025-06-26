
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, FileText, Search, Upload } from 'lucide-react';

export const DiseaseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [diseases] = useState([
    {
      id: 1,
      name: 'Tiểu đường type 2',
      code: 'E11',
      category: 'Bệnh nội tiết',
      hasDescription: true,
      hasSummary: true,
      relatedTests: ['HbA1c', 'Glucose', 'Insulin'],
      riskFactors: 12
    },
    {
      id: 2,
      name: 'Tăng huyết áp',
      code: 'I10',
      category: 'Bệnh tim mạch',
      hasDescription: true,
      hasSummary: false,
      relatedTests: ['Systolic BP', 'Diastolic BP'],
      riskFactors: 8
    },
    {
      id: 3,
      name: 'Rối loạn lipid máu',
      code: 'E78',
      category: 'Bệnh chuyển hóa',
      hasDescription: false,
      hasSummary: true,
      relatedTests: ['Total Cholesterol', 'LDL', 'HDL', 'Triglycerides'],
      riskFactors: 15
    }
  ]);

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
                  <Button className="mt-4">Chọn file</Button>
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên bệnh</label>
                  <Input placeholder="Nhập tên bệnh" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mã ICD</label>
                  <Input placeholder="Nhập mã ICD" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục</label>
                  <Input placeholder="Nhập danh mục bệnh" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">File mô tả bệnh</label>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Chọn file PDF/DOC
                  </Button>
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700">Thêm bệnh</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm bệnh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {diseases.map((disease) => (
              <Card key={disease.id} className="border border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{disease.name}</CardTitle>
                      <p className="text-sm text-slate-600">{disease.code} - {disease.category}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Tài liệu mô tả:</span>
                    <Badge variant={disease.hasDescription ? 'default' : 'secondary'}>
                      {disease.hasDescription ? 'Có' : 'Chưa có'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Tóm tắt bệnh:</span>
                    <Badge variant={disease.hasSummary ? 'default' : 'secondary'}>
                      {disease.hasSummary ? 'Có' : 'Chưa có'}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600">
                    <strong>Chỉ số liên quan:</strong> {disease.relatedTests.join(', ')}
                  </div>
                  <div className="text-sm text-slate-600">
                    <strong>Yếu tố nguy cơ:</strong> {disease.riskFactors} yếu tố
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">Chỉnh sửa</Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <FileText className="h-3 w-3 mr-1" />
                      Tài liệu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
