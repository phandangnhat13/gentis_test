
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BIOMARKER_LIST } from '@/data/biomarkers';

export const GentisTestManagement = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isManualInputOpen, setIsManualInputOpen] = useState(false);
  const [manualTestData, setManualTestData] = useState(
    BIOMARKER_LIST.map((biomarker, index) => ({
      index: index + 1,
      name: biomarker.name,
      result: '',
      reference: '',
      assessment: ''
    }))
  );
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      console.log('File đã chọn:', file.name, file.size, file.type);
    }
  };

  const handleManualDataChange = (index: number, field: string, value: string) => {
    const newData = [...manualTestData];
    newData[index] = { ...newData[index], [field]: value };
    setManualTestData(newData);
  };

  const handleCreateTestFromFile = (formData: FormData) => {
    const testName = formData.get('testName') as string;
    const description = formData.get('description') as string;
    
    if (uploadedFile) {
      console.log('Tạo xét nghiệm từ file:', {
        name: testName,
        description: description,
        file: uploadedFile.name,
        fileSize: uploadedFile.size,
        fileType: uploadedFile.type
      });

      toast({
        title: "Tạo xét nghiệm thành công",
        description: `Xét nghiệm "${testName}" đã được tạo từ file "${uploadedFile.name}"`,
      });
      
      setUploadedFile(null);
    }
  };

  const handleCreateTestFromManualData = (formData: FormData) => {
    const testName = formData.get('testName') as string;
    const description = formData.get('description') as string;
    const patientName = formData.get('patientName') as string;
    const patientCode = formData.get('patientCode') as string;
    const birthDate = formData.get('birthDate') as string;
    const phone = formData.get('phone') as string;
    const branch = formData.get('branch') as string;
    
    // Get filled biomarkers
    const filledBiomarkers = manualTestData.filter(item => 
      item.result.trim() || item.reference.trim() || item.assessment.trim()
    );

    if (!testName || !patientName || filledBiomarkers.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    console.log('Tạo xét nghiệm từ dữ liệu nhập tay:', {
      testName,
      description,
      patientInfo: { patientName, patientCode, birthDate, phone, branch },
      biomarkers: filledBiomarkers
    });

    toast({
      title: "Tạo xét nghiệm thành công",
      description: `Xét nghiệm "${testName}" đã được tạo và đang xử lý`,
    });

    setIsManualInputOpen(false);
    // Reset form
    setManualTestData(
      BIOMARKER_LIST.map((biomarker, index) => ({
        index: index + 1,
        name: biomarker.name,
        result: '',
        reference: '',
        assessment: ''
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Tạo xét nghiệm</h2>
      </div>

      {/* Create New Test Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tạo xét nghiệm mới</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload Method */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-32 flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 border-2 border-dashed border-blue-300">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="font-medium">Tải file lên</span>
                  <span className="text-sm opacity-75">CSV, Excel</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo xét nghiệm từ file</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateTestFromFile(new FormData(e.currentTarget));
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="testName">Tên xét nghiệm *</Label>
                    <Input id="testName" name="testName" placeholder="Nhập tên xét nghiệm" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      placeholder="Mô tả chi tiết về xét nghiệm"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="file">File dữ liệu xét nghiệm *</Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 mb-2">Kéo thả file hoặc click để chọn</p>
                      <p className="text-xs text-slate-500 mb-2">Hỗ trợ: CSV, Excel</p>
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
                    Tạo xét nghiệm từ file
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* Manual Input Method */}
            <Dialog open={isManualInputOpen} onOpenChange={setIsManualInputOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 text-green-700 border-2 border-dashed border-green-300"
                >
                  <Plus className="h-8 w-8 mb-2" />
                  <span className="font-medium">Nhập kết quả chi tiết</span>
                  <span className="text-sm opacity-75">77 chỉ số</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nhập kết quả chi tiết xét nghiệm</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateTestFromManualData(new FormData(e.currentTarget));
                }} className="space-y-6">
                  {/* Basic Test Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="testName">Tên xét nghiệm *</Label>
                      <Input id="testName" name="testName" placeholder="Nhập tên xét nghiệm" required />
                    </div>
                    <div>
                      <Label htmlFor="description">Mô tả</Label>
                      <Input id="description" name="description" placeholder="Mô tả xét nghiệm" />
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Thông tin bệnh nhân</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="patientName">Họ tên *</Label>
                        <Input id="patientName" name="patientName" placeholder="Nhập họ tên" required />
                      </div>
                      <div>
                        <Label htmlFor="patientCode">Mã bệnh nhân</Label>
                        <Input id="patientCode" name="patientCode" placeholder="Mã BN" />
                      </div>
                      <div>
                        <Label htmlFor="birthDate">Ngày sinh</Label>
                        <Input id="birthDate" name="birthDate" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" name="phone" placeholder="Số điện thoại" />
                      </div>
                      <div>
                        <Label htmlFor="branch">Chi nhánh</Label>
                        <Input id="branch" name="branch" placeholder="Chi nhánh Gentis" />
                      </div>
                    </div>
                  </div>

                  {/* Biomarkers Input */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Kết quả 77 chỉ số xét nghiệm</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 w-16">STT</th>
                            <th className="text-left p-2">Tên chỉ số</th>
                            <th className="text-left p-2">Kết quả</th>
                            <th className="text-left p-2">Khoảng tham chiếu</th>
                            <th className="text-left p-2">Nhận định</th>
                          </tr>
                        </thead>
                        <tbody>
                          {manualTestData.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">
                                <span className="text-sm text-slate-600">{item.index}</span>
                              </td>
                              <td className="p-2">
                                <span className="text-sm font-medium">{item.name}</span>
                              </td>
                              <td className="p-2">
                                <Input
                                  value={item.result}
                                  onChange={(e) => handleManualDataChange(index, 'result', e.target.value)}
                                  placeholder="Kết quả"
                                  className="h-8"
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  value={item.reference}
                                  onChange={(e) => handleManualDataChange(index, 'reference', e.target.value)}
                                  placeholder="Khoảng tham chiếu"
                                  className="h-8"
                                />
                              </td>
                              <td className="p-2">
                                <select
                                  value={item.assessment}
                                  onChange={(e) => handleManualDataChange(index, 'assessment', e.target.value)}
                                  className="h-8 w-full px-2 border border-slate-300 rounded text-sm"
                                >
                                  <option value="">Chọn nhận định</option>
                                  <option value="Tăng">Tăng</option>
                                  <option value="Giảm">Giảm</option>
                                  <option value="Trong ngưỡng">Trong ngưỡng</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Tạo xét nghiệm
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsManualInputOpen(false)}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
