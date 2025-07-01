
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Upload, FileText, AlertTriangle, Download, FileSpreadsheet, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const GentisTestManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  // Enhanced test data with detailed biomarkers
  const [tests] = useState([
    {
      id: 1,
      code: 'XN_240115_001',
      name: 'Sinh hóa máu tổng quát',
      date: '2024-01-15',
      samples: 15,
      status: 'completed',
      riskSamples: 3,
      processingTime: '2h 15m',
      suggestedDiseases: ['Tiểu đường type 2', 'Rối loạn lipid', 'Gan nhiễm mỡ'],
      detailedBiomarkers: [
        { name: 'Glucose', values: [180, 165, 200, 95, 88, 92, 175, 145, 190, 82, 78, 85, 195, 88, 92], normal: '70-100', unit: 'mg/dL' },
        { name: 'HbA1c', values: [8.5, 7.8, 9.2, 5.1, 4.8, 5.3, 8.1, 7.2, 8.8, 4.9, 4.6, 5.0, 9.0, 5.2, 5.1], normal: '4-6', unit: '%' },
        { name: 'Cholesterol', values: [260, 240, 280, 185, 175, 190, 250, 220, 270, 180, 170, 185, 275, 190, 180], normal: '<200', unit: 'mg/dL' },
        { name: 'ALT', values: [45, 42, 48, 25, 22, 28, 44, 38, 46, 24, 21, 27, 47, 26, 25], normal: '7-56', unit: 'U/L' },
        { name: 'AST', values: [38, 35, 41, 22, 19, 25, 37, 32, 39, 21, 18, 24, 40, 23, 22], normal: '10-40', unit: 'U/L' }
      ],
      patientCodes: ['PT001', 'PT002', 'PT003', 'PT004', 'PT005', 'PT006', 'PT007', 'PT008', 'PT009', 'PT010', 'PT011', 'PT012', 'PT013', 'PT014', 'PT015']
    },
    {
      id: 2,
      code: 'XN_240114_002',
      name: 'Lipid profile',
      date: '2024-01-14',
      samples: 8,
      status: 'processing',
      riskSamples: 2,
      processingTime: '1h 30m',
      suggestedDiseases: ['Rối loạn lipid máu', 'Xơ vữa động mạch'],
      detailedBiomarkers: [
        { name: 'Total Cholesterol', values: [280, 250, 185, 190, 195, 220, 240, 175], normal: '<200', unit: 'mg/dL' },
        { name: 'LDL', values: [180, 160, 95, 100, 105, 140, 150, 85], normal: '<100', unit: 'mg/dL' },
        { name: 'HDL', values: [35, 38, 55, 52, 58, 42, 40, 60], normal: '>40', unit: 'mg/dL' },
        { name: 'Triglycerides', values: [250, 220, 120, 130, 140, 180, 200, 110], normal: '<150', unit: 'mg/dL' }
      ],
      patientCodes: ['PT016', 'PT017', 'PT018', 'PT019', 'PT020', 'PT021', 'PT022', 'PT023']
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

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('Nội dung file:', content.substring(0, 200) + '...');
        
        setTimeout(() => {
          toast({
            title: "Xét nghiệm đã được tạo",
            description: `Xét nghiệm "${testName}" đã được tạo và đang xử lý dữ liệu từ file "${uploadedFile.name}"`,
          });
        }, 1000);
      };
      reader.readAsText(uploadedFile);
      
      setUploadedFile(null);
    }
  };

  const exportDetailedReport = (test: any) => {
    // Create detailed CSV with all biomarker data
    const csvLines = [
      'Thông tin xét nghiệm',
      `Mã xét nghiệm,${test.code}`,
      `Tên xét nghiệm,${test.name}`,
      `Ngày thực hiện,${test.date}`,
      `Số mẫu,${test.samples}`,
      `Trạng thái,${test.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}`,
      `Thời gian xử lý,${test.processingTime}`,
      '',
      'Kết quả chi tiết theo chỉ số',
      `Chỉ số,${test.patientCodes.join(',')}`,
      `Khoảng tham chiếu,${test.detailedBiomarkers[0]?.normal || 'N/A'}`,
      `Nhận định,${test.detailedBiomarkers[0]?.values.map((_, i) => {
        const patientCode = test.patientCodes[i];
        const riskSample = test.riskSamples > 0 && ['PT001', 'PT003', 'PT007'].includes(patientCode);
        return riskSample ? 'Tăng' : 'Bình thường';
      }).join(',')}`
    ];

    // Add biomarker data
    test.detailedBiomarkers.forEach((biomarker: any) => {
      csvLines.push(`${biomarker.name} (${biomarker.unit}),${biomarker.values.join(',')}`);
    });

    csvLines.push('', 'Thông tin bệnh nhân');
    csvLines.push(`Họ tên,${test.patientCodes.map((code: string) => `Bệnh nhân ${code}`).join(',')}`);
    csvLines.push(`Tuổi,${test.patientCodes.map(() => Math.floor(Math.random() * 40) + 30).join(',')}`);
    csvLines.push(`Giới tính,${test.patientCodes.map(() => Math.random() > 0.5 ? 'Nam' : 'Nữ').join(',')}`);
    csvLines.push(`Mã bệnh nhân,${test.patientCodes.join(',')}`);

    const csvContent = csvLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KetQuaChiTiet_${test.code}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Xuất kết quả thành công",
      description: `Đã xuất file kết quả chi tiết cho ${test.code}`,
    });
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

  const filteredTests = tests.filter(test =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý xét nghiệm - Gentis</h2>
        <div className="flex space-x-2">
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
          <div className="space-y-6">
            {filteredTests.map((test) => (
              <Card key={test.id} className="border border-slate-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{test.code}</CardTitle>
                      <p className="text-sm text-slate-600">{test.name} • {test.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(test.status)}
                      <Badge variant="outline">
                        {test.samples} mẫu
                      </Badge>
                      {test.riskSamples > 0 && (
                        <Badge variant="destructive" className="flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {test.riskSamples} nguy cơ cao
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">Bệnh được gợi ý:</p>
                    <p className="text-sm text-blue-700">{test.suggestedDiseases.join(', ')}</p>
                  </div>

                  {/* Detailed Biomarker Table */}
                  <div>
                    <h4 className="font-medium text-slate-800 mb-3">Bảng kết quả chi tiết</h4>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[120px]">Tên chỉ số</TableHead>
                            <TableHead className="min-w-[100px]">Kết quả</TableHead>
                            <TableHead className="min-w-[120px]">Khoảng tham chiếu</TableHead>
                            <TableHead className="min-w-[100px]">Nhận định</TableHead>
                            {test.patientCodes.slice(0, 6).map((code, index) => (
                              <TableHead key={index} className="min-w-[80px] text-center">
                                {code}
                              </TableHead>
                            ))}
                            {test.samples > 6 && (
                              <TableHead className="min-w-[60px] text-center">...</TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {test.detailedBiomarkers.map((biomarker, bioIndex) => (
                            <TableRow key={bioIndex}>
                              <TableCell className="font-medium">{biomarker.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {biomarker.unit}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-slate-600">
                                {biomarker.normal}
                              </TableCell>
                              <TableCell>
                                <Badge variant={test.riskSamples > 0 ? "destructive" : "secondary"} className="text-xs">
                                  {test.riskSamples > 0 ? "Có bất thường" : "Bình thường"}
                                </Badge>
                              </TableCell>
                              {biomarker.values.slice(0, 6).map((value, valIndex) => {
                                const isAbnormal = test.riskSamples > 0 && ['PT001', 'PT003', 'PT007'].includes(test.patientCodes[valIndex]);
                                return (
                                  <TableCell key={valIndex} className={`text-center text-sm ${
                                    isAbnormal ? 'text-red-600 font-medium' : 'text-slate-700'
                                  }`}>
                                    {value}
                                  </TableCell>
                                );
                              })}
                              {test.samples > 6 && (
                                <TableCell className="text-center text-slate-400">...</TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2 border-t border-slate-200">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => exportDetailedReport(test)}
                    >
                      <FileSpreadsheet className="h-3 w-3 mr-1" />
                      Xuất kết quả chi tiết
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                    >
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Xem biểu đồ
                    </Button>
                    {test.riskSamples > 0 && (
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Cảnh báo nguy cơ cao
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
