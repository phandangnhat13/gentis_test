
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Upload, FileText, AlertTriangle } from 'lucide-react';

export const TestManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tests] = useState([
    {
      id: 1,
      code: 'XN_240101_001',
      name: 'Sinh hóa máu tổng quát',
      date: '2024-01-15',
      samples: 15,
      status: 'completed',
      riskSamples: 3,
      processingTime: '2h 15m',
      suggestedDiseases: ['Tiểu đường type 2', 'Rối loạn lipid', 'Gan nhiễm mỡ']
    },
    {
      id: 2,
      code: 'XN_240101_002',
      name: 'Lipid profile',
      date: '2024-01-15',
      samples: 8,
      status: 'processing',
      riskSamples: 2,
      processingTime: '1h 30m',
      suggestedDiseases: ['Rối loạn lipid máu', 'Xơ vữa động mạch']
    },
    {
      id: 3,
      code: 'XN_240101_003',
      name: 'HbA1c và Glucose',
      date: '2024-01-14',
      samples: 12,
      status: 'completed',
      riskSamples: 4,
      processingTime: '1h 45m',
      suggestedDiseases: ['Tiểu đường type 2', 'Tiền tiểu đường']
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>;
      case 'pending':
        return <Badge variant="secondary">Chờ xử lý</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý xét nghiệm</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo xét nghiệm mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo xét nghiệm mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên xét nghiệm</label>
                <Input placeholder="Nhập tên xét nghiệm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea 
                  className="w-full p-2 border border-slate-300 rounded-md h-20"
                  placeholder="Mô tả chi tiết về xét nghiệm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">File dữ liệu xét nghiệm</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-2">Kéo thả file hoặc click để chọn</p>
                  <p className="text-xs text-slate-500">Hỗ trợ: CSV, Excel (nhiều mẫu)</p>
                  <Button className="mt-2" size="sm">Chọn file</Button>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Tạo và xử lý xét nghiệm</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm xét nghiệm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map((test) => (
              <Card key={test.id} className="border border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      <p className="text-sm text-slate-600">Mã XN: {test.code}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {test.riskSamples > 0 && (
                        <Badge variant="destructive" className="flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {test.riskSamples} mẫu nguy cơ cao
                        </Badge>
                      )}
                      {getStatusBadge(test.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Ngày tạo:</span>
                      <div className="font-medium">{test.date}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Số mẫu:</span>
                      <div className="font-medium">{test.samples}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Thời gian xử lý:</span>
                      <div className="font-medium">{test.processingTime}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Mẫu nguy cơ cao:</span>
                      <div className="font-medium text-red-600">{test.riskSamples}</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-slate-600 block mb-2">Bệnh được gợi ý:</span>
                    <div className="flex flex-wrap gap-1">
                      {test.suggestedDiseases.map((disease, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {disease}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" disabled={test.status === 'processing'}>
                      <FileText className="h-3 w-3 mr-1" />
                      Xem kết quả
                    </Button>
                    <Button size="sm" variant="outline">
                      Xuất báo cáo
                    </Button>
                    {test.riskSamples > 0 && (
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Xem cảnh báo
                      </Button>
                    )}
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
