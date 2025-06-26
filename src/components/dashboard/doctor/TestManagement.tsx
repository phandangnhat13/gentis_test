
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Upload, FileText, AlertTriangle } from 'lucide-react';

export const TestManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      console.log('File đã chọn:', file.name, file.size, file.type);
    }
  };

  const handleCreateTest = (formData: FormData) => {
    const testName = formData.get('testName') as string;
    const description = formData.get('description') as string;
    
    if (uploadedFile) {
      console.log('Tạo xét nghiệm mới:', {
        name: testName,
        description: description,
        file: uploadedFile.name,
        fileSize: uploadedFile.size,
        fileType: uploadedFile.type
      });

      // Giả lập xử lý file CSV/Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('Nội dung file:', content.substring(0, 200) + '...');
        
        // Giả lập phân tích dữ liệu
        setTimeout(() => {
          alert(`Xét nghiệm "${testName}" đã được tạo và đang xử lý dữ liệu từ file "${uploadedFile.name}"`);
        }, 1000);
      };
      reader.readAsText(uploadedFile);
      
      setUploadedFile(null);
    }
  };

  const handleExportReport = (testId: number) => {
    const test = tests.find(t => t.id === testId);
    if (test) {
      const reportContent = `
        BÁO CÁO XÉT NGHIỆM
        ==================
        
        Mã xét nghiệm: ${test.code}
        Tên xét nghiệm: ${test.name}
        Ngày thực hiện: ${test.date}
        Số mẫu: ${test.samples}
        Thời gian xử lý: ${test.processingTime}
        
        KẾT QUẢ PHÂN TÍCH:
        - Số mẫu nguy cơ cao: ${test.riskSamples}
        - Tỷ lệ nguy cơ cao: ${((test.riskSamples / test.samples) * 100).toFixed(1)}%
        
        CÁC BỆNH ĐƯỢC GỢI Ý:
        ${test.suggestedDiseases.map((disease, index) => `${index + 1}. ${disease}`).join('\n        ')}
        
        ==================
        Báo cáo được tạo bởi SLSS Gentis
        Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}
      `;

      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BaoCao_${test.code}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Xuất báo cáo cho xét nghiệm:', test.name);
    }
  };

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
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateTest(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên xét nghiệm</label>
                <Input name="testName" placeholder="Nhập tên xét nghiệm" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea 
                  name="description"
                  className="w-full p-2 border border-slate-300 rounded-md h-20"
                  placeholder="Mô tả chi tiết về xét nghiệm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">File dữ liệu xét nghiệm</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-2">Kéo thả file hoặc click để chọn</p>
                  <p className="text-xs text-slate-500 mb-2">Hỗ trợ: CSV, Excel (nhiều mẫu)</p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Chọn file
                  </Button>
                  {uploadedFile && (
                    <div className="mt-2 p-2 bg-green-50 rounded">
                      <p className="text-sm text-green-800">
                        ✓ Đã chọn: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!uploadedFile}
              >
                Tạo và xử lý xét nghiệm
              </Button>
            </form>
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
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleExportReport(test.id)}
                    >
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
