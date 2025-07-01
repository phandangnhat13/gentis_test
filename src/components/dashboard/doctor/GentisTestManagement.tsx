
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Upload, FileText, AlertTriangle, Download, FileSpreadsheet, BarChart3, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const defaultBiomarkers = [
  'Glucose', 'HbA1c', 'Total Cholesterol', 'LDL', 'HDL', 'Triglycerides', 'ALT', 'AST', 'Creatinine', 'BUN',
  'Sodium', 'Potassium', 'Chloride', 'CO2', 'Hemoglobin', 'Hematocrit', 'WBC', 'RBC', 'Platelets', 'TSH',
  'T3', 'T4', 'Insulin', 'C-Peptide', 'Cortisol', 'Testosterone', 'Estradiol', 'Progesterone', 'PSA', 'AFP',
  'CEA', 'CA 19-9', 'CA 125', 'Ferritin', 'Transferrin', 'Iron', 'TIBC', 'Vitamin D', 'Vitamin B12', 'Folate',
  'Magnesium', 'Phosphorus', 'Calcium', 'Albumin', 'Total Protein', 'Bilirubin Total', 'Bilirubin Direct', 'ALP',
  'GGT', 'Amylase', 'Lipase', 'CK', 'LDH', 'Troponin', 'BNP', 'CRP', 'ESR', 'Prothrombin Time', 'PTT',
  'INR', 'Fibrinogen', 'D-Dimer', 'Homocysteine', 'Uric Acid', 'Lactate', 'Ketones', 'Microalbumin', 'Protein (Urine)',
  'Glucose (Urine)', 'Specific Gravity', 'pH (Urine)', 'Nitrites', 'Leukocyte Esterase', 'Blood (Urine)', 'Bacteria', 'Epithelial Cells',
  'RBC (Urine)', 'WBC (Urine)', 'Casts', 'Crystals', 'Mucus', 'Yeast', 'Parasites', 'Other', 'Additional Test 1', 'Additional Test 2',
  'Additional Test 3', 'Additional Test 4', 'Additional Test 5', 'Additional Test 6', 'Additional Test 7'
];

export const GentisTestManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualTestData, setManualTestData] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Enhanced test data with detailed biomarkers
  const [tests, setTests] = useState([
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
      patientInfo: {
        name: 'Nguyễn Văn A',
        age: 45,
        gender: 'Nam',
        patientCode: 'PT001'
      },
      detailedBiomarkers: [
        { name: 'Glucose', values: [180], normal: '70-100', unit: 'mg/dL', assessment: 'Tăng' },
        { name: 'HbA1c', values: [8.5], normal: '4-6', unit: '%', assessment: 'Tăng' },
        { name: 'Cholesterol', values: [260], normal: '<200', unit: 'mg/dL', assessment: 'Tăng' },
        { name: 'ALT', values: [45], normal: '7-56', unit: 'U/L', assessment: 'Trong ngưỡng' },
        { name: 'AST', values: [38], normal: '10-40', unit: 'U/L', assessment: 'Trong ngưỡng' }
      ],
      patientCodes: ['PT001']
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
      patientInfo: {
        name: 'Trần Thị B',
        age: 52,
        gender: 'Nữ',
        patientCode: 'PT002'
      },
      detailedBiomarkers: [
        { name: 'Total Cholesterol', values: [280], normal: '<200', unit: 'mg/dL', assessment: 'Tăng' },
        { name: 'LDL', values: [180], normal: '<100', unit: 'mg/dL', assessment: 'Tăng' },
        { name: 'HDL', values: [35], normal: '>40', unit: 'mg/dL', assessment: 'Giảm' },
        { name: 'Triglycerides', values: [250], normal: '<150', unit: 'mg/dL', assessment: 'Tăng' }
      ],
      patientCodes: ['PT002']
    }
  ]);

  const initializeManualTestData = () => {
    const data = [];
    for (let i = 1; i <= 77; i++) {
      data.push({
        id: i,
        name: defaultBiomarkers[i - 1] || ``,
        result: '',
        referenceRange: '',
        assessment: ''
      });
    }
    setManualTestData(data);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      console.log('File đã chọn:', file.name, file.size, file.type);
    }
  };

  const handleCreateTestFromFile = (formData: FormData) => {
    const testName = formData.get('testName') as string;
    const description = formData.get('description') as string;
    
    if (uploadedFile) {
      console.log('Tạo xét nghiệm mới từ file:', {
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

  const handleCreateTestFromManual = (formData: FormData) => {
    const testName = formData.get('testName') as string;
    const description = formData.get('description') as string;
    const patientName = formData.get('patientName') as string;
    const patientAge = formData.get('patientAge') as string;
    const patientGender = formData.get('patientGender') as string;
    const patientCode = formData.get('patientCode') as string;
    
    if (!testName || !patientName || !patientCode) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    // Create new test from manual data
    const filledData = manualTestData.filter(item => item.result || item.referenceRange || item.assessment || item.name);
    
    const newTest = {
      id: tests.length + 1,
      code: `XN_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}_${String(tests.length + 1).padStart(3, '0')}`,
      name: testName,
      date: new Date().toISOString().slice(0, 10),
      samples: 1,
      status: 'processing',
      riskSamples: 0,
      processingTime: '0m',
      suggestedDiseases: [],
      patientInfo: {
        name: patientName,
        age: parseInt(patientAge) || 0,
        gender: patientGender,
        patientCode: patientCode
      },
      detailedBiomarkers: filledData.map(item => ({
        name: item.name || `Chỉ số ${item.id}`,
        values: [item.result || 'N/A'],
        normal: item.referenceRange || 'N/A',
        unit: '',
        assessment: item.assessment || 'Chưa đánh giá'
      })),
      patientCodes: [patientCode]
    };

    setTests(prev => [...prev, newTest]);
    
    console.log('Tạo xét nghiệm mới từ dữ liệu nhập tay:', {
      name: testName,
      description: description,
      patientInfo: { name: patientName, age: patientAge, gender: patientGender, code: patientCode },
      data: filledData
    });
    
    toast({
      title: "Xét nghiệm đã được tạo",
      description: `Xét nghiệm "${testName}" cho bệnh nhân ${patientName} đã được tạo với ${filledData.length} chỉ số`,
    });
    
    // Reset manual data
    setManualTestData([]);
  };

  const updateManualTestData = (id: number, field: string, value: string) => {
    setManualTestData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
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
      'Thông tin bệnh nhân',
      `Họ tên,${test.patientInfo?.name || 'N/A'}`,
      `Tuổi,${test.patientInfo?.age || 'N/A'}`,
      `Giới tính,${test.patientInfo?.gender || 'N/A'}`,
      `Mã bệnh nhân,${test.patientInfo?.patientCode || 'N/A'}`,
      '',
      'Kết quả chi tiết theo chỉ số',
      'Chỉ số,Kết quả,Khoảng tham chiếu,Nhận định'
    ];

    test.detailedBiomarkers.forEach((biomarker: any) => {
      csvLines.push(`${biomarker.name} (${biomarker.unit}),${biomarker.values[0]},${biomarker.normal},${biomarker.assessment}`);
    });

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

  const getAssessmentBadge = (assessment: string) => {
    switch (assessment) {
      case 'Tăng':
        return <Badge variant="destructive" className="text-xs">Tăng</Badge>;
      case 'Giảm':
        return <Badge variant="destructive" className="text-xs">Giảm</Badge>;
      case 'Trong ngưỡng':
        return <Badge variant="secondary" className="text-xs">Trong ngưỡng</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{assessment}</Badge>;
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
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo xét nghiệm mới</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="file" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file">Tải file lên</TabsTrigger>
                  <TabsTrigger value="manual" onClick={initializeManualTestData}>Nhập kết quả chi tiết</TabsTrigger>
                </TabsList>
                
                <TabsContent value="file">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateTestFromFile(new FormData(e.currentTarget));
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
                </TabsContent>
                
                <TabsContent value="manual">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateTestFromManual(new FormData(e.currentTarget));
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Tên xét nghiệm *</label>
                        <Input name="testName" placeholder="Nhập tên xét nghiệm" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Mô tả</label>
                        <Input name="description" placeholder="Mô tả chi tiết về xét nghiệm" />
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-slate-50">
                      <h3 className="font-medium mb-3">Thông tin bệnh nhân</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Họ tên bệnh nhân *</label>
                          <Input name="patientName" placeholder="Nhập họ tên" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Mã bệnh nhân *</label>
                          <Input name="patientCode" placeholder="VD: PT001" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Tuổi</label>
                          <Input name="patientAge" type="number" placeholder="Nhập tuổi" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Giới tính</label>
                          <select name="patientGender" className="w-full p-2 border border-slate-300 rounded-md">
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Nhập kết quả chi tiết</h3>
                      <div className="max-h-96 overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16">STT</TableHead>
                              <TableHead className="w-48">Tên chỉ số</TableHead>
                              <TableHead className="w-32">Kết quả</TableHead>
                              <TableHead className="w-40">Khoảng tham chiếu</TableHead>
                              <TableHead>Nhận định</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {manualTestData.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.id}</TableCell>
                                <TableCell>
                                  <Input
                                    value={item.name}
                                    onChange={(e) => updateManualTestData(item.id, 'name', e.target.value)}
                                    placeholder={`Chỉ số ${item.id}`}
                                    className="text-sm"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={item.result}
                                    onChange={(e) => updateManualTestData(item.id, 'result', e.target.value)}
                                    placeholder="Kết quả"
                                    className="text-sm"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={item.referenceRange}
                                    onChange={(e) => updateManualTestData(item.id, 'referenceRange', e.target.value)}
                                    placeholder="VD: 70-100"
                                    className="text-sm"
                                  />
                                </TableCell>
                                <TableCell>
                                  <select
                                    value={item.assessment}
                                    onChange={(e) => updateManualTestData(item.id, 'assessment', e.target.value)}
                                    className="w-full p-1 border border-slate-300 rounded text-sm"
                                  >
                                    <option value="">Chọn nhận định</option>
                                    <option value="Tăng">Tăng</option>
                                    <option value="Giảm">Giảm</option>
                                    <option value="Trong ngưỡng">Trong ngưỡng</option>
                                  </select>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Tạo xét nghiệm từ dữ liệu nhập tay
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
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
                      {test.patientInfo && (
                        <p className="text-sm text-blue-600 mt-1">
                          Bệnh nhân: {test.patientInfo.name} ({test.patientInfo.patientCode}) - {test.patientInfo.age} tuổi - {test.patientInfo.gender}
                        </p>
                      )}
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
                  {test.suggestedDiseases.length > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">Bệnh được gợi ý:</p>
                      <p className="text-sm text-blue-700">{test.suggestedDiseases.join(', ')}</p>
                    </div>
                  )}

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
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {test.detailedBiomarkers.map((biomarker, bioIndex) => (
                            <TableRow key={bioIndex}>
                              <TableCell className="font-medium">
                                {biomarker.name}
                                {biomarker.unit && (
                                  <Badge variant="outline" className="text-xs ml-2">
                                    {biomarker.unit}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="font-medium">
                                {biomarker.values[0]}
                              </TableCell>
                              <TableCell className="text-sm text-slate-600">
                                {biomarker.normal}
                              </TableCell>
                              <TableCell>
                                {getAssessmentBadge(biomarker.assessment)}
                              </TableCell>
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
