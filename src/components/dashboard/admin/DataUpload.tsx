
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Database, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  uploadDate: string;
}

export const DataUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'ma_tran_benh_2024.csv',
      size: 245760,
      type: 'text/csv',
      status: 'completed',
      progress: 100,
      uploadDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'biomarkers_data.xlsx',
      size: 512000,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      status: 'completed',
      progress: 100,
      uploadDate: '2024-01-14'
    }
  ]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const fileId = Date.now().toString() + Math.random().toString();
        const newFile: UploadedFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'uploading',
          progress: 0,
          uploadDate: new Date().toISOString().split('T')[0]
        };

        setUploadedFiles(prev => [...prev, newFile]);

        // Simulate file upload progress
        const interval = setInterval(() => {
          setUploadedFiles(prev => 
            prev.map(f => {
              if (f.id === fileId) {
                const newProgress = Math.min(f.progress + Math.random() * 20, 100);
                if (newProgress >= 100) {
                  clearInterval(interval);
                  
                  // Simulate file processing
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const content = e.target?.result as string;
                    console.log(`Nội dung file ${file.name}:`, 
                      content.substring(0, 200) + (content.length > 200 ? '...' : ''));
                    
                    toast({
                      title: "Upload thành công",
                      description: `File ${file.name} đã được tải lên và xử lý`,
                    });
                  };
                  
                  if (file.type.includes('text') || file.name.endsWith('.csv')) {
                    reader.readAsText(file);
                  } else {
                    reader.readAsArrayBuffer(file);
                  }
                  
                  return { ...f, status: 'completed' as const, progress: 100 };
                }
                return { ...f, progress: newProgress };
              }
              return f;
            })
          );
        }, 200);
      });
    }
    
    // Reset input
    event.target.value = '';
  };

  const handleDeleteFile = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    
    toast({
      title: "Đã xóa file",
      description: `File ${file?.name} đã được xóa khỏi hệ thống`,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('csv') || type.includes('text')) {
      return <Database className="h-8 w-8 text-green-600" />;
    } else if (type.includes('sheet') || type.includes('excel')) {
      return <FileText className="h-8 w-8 text-blue-600" />;
    }
    return <FileText className="h-8 w-8 text-slate-600" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Hoàn thành</Badge>;
      case 'uploading':
        return <Badge className="bg-blue-100 text-blue-800">Đang tải...</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Lỗi</Badge>;
      default:
        return <Badge variant="secondary">Chưa xác định</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Upload dữ liệu</h2>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tải lên file dữ liệu mới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
            <Upload className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              Kéo thả file hoặc click để chọn
            </h3>
            <p className="text-slate-500 mb-4">
              Hỗ trợ file CSV, Excel (.xlsx, .xls) và file text
            </p>
            <input
              type="file"
              multiple
              accept=".csv,.xlsx,.xls,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="bg-red-600 hover:bg-red-700 cursor-pointer" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Chọn file từ máy tính
                </span>
              </Button>
            </label>
          </div>
          
          <div className="mt-4 text-sm text-slate-600">
            <p><strong>Lưu ý:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>File CSV: Chứa ma trận bệnh và các chỉ số sinh học</li>
              <li>File Excel: Dữ liệu xét nghiệm từ các thiết bị y tế</li>
              <li>Kích thước tối đa: 50MB mỗi file</li>
              <li>Định dạng dữ liệu phải tuân thủ chuẩn của hệ thống</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Tổng file</p>
                <p className="text-2xl font-bold text-blue-600">{uploadedFiles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Đã xử lý</p>
                <p className="text-2xl font-bold text-green-600">
                  {uploadedFiles.filter(f => f.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Upload className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Đang tải</p>
                <p className="text-2xl font-bold text-orange-600">
                  {uploadedFiles.filter(f => f.status === 'uploading').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Lỗi</p>
                <p className="text-2xl font-bold text-red-600">
                  {uploadedFiles.filter(f => f.status === 'error').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách file đã tải lên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg">
                <div className="flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {file.name}
                    </p>
                    {getStatusBadge(file.status)}
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-sm text-slate-500">
                      Kích thước: {formatFileSize(file.size)}
                    </p>
                    <p className="text-sm text-slate-500">
                      Ngày tải: {file.uploadDate}
                    </p>
                  </div>
                  {file.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Tiến độ:</span>
                        <span className="text-slate-600">{Math.round(file.progress)}%</span>
                      </div>
                      <Progress value={file.progress} className="mt-1" />
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
