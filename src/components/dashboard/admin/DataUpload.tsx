
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const DataUpload = () => {
  const [uploadHistory] = useState([
    {
      id: 1,
      filename: 'disease_matrix_v2.csv',
      type: 'Ma trận bệnh',
      uploadDate: '2024-01-15',
      status: 'success',
      records: 157,
      description: 'Cập nhật ma trận quan hệ bệnh - chỉ số sinh học'
    },
    {
      id: 2,
      filename: 'biomarkers_reference.csv',
      type: 'Chỉ số tham chiếu',
      uploadDate: '2024-01-10',
      status: 'success',
      records: 245,
      description: 'Giá trị tham chiếu cho các chỉ số sinh học'
    },
    {
      id: 3,
      filename: 'disease_descriptions.zip',
      type: 'Mô tả bệnh',
      uploadDate: '2024-01-08',
      status: 'processing',
      records: 85,
      description: 'File PDF mô tả chi tiết các bệnh lý'
    }
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Upload & quản lý dữ liệu</h2>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
          <CardHeader className="text-center">
            <Database className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <CardTitle className="text-lg">Ma trận bệnh</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-slate-600">Upload file CSV chứa mối quan hệ giữa bệnh và các chỉ số sinh học</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Chọn file CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-green-200 hover:border-green-400 transition-colors cursor-pointer">
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <CardTitle className="text-lg">File mô tả bệnh</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-slate-600">Upload file PDF hoặc DOC mô tả chi tiết về các bệnh lý</p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Upload className="h-4 w-4 mr-2" />
              Chọn file
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors cursor-pointer">
          <CardHeader className="text-center">
            <Database className="h-12 w-12 text-purple-500 mx-auto mb-2" />
            <CardTitle className="text-lg">Dữ liệu tham chiếu</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-slate-600">Upload giá trị tham chiếu và ngưỡng cảnh báo cho các chỉ số</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Upload className="h-4 w-4 mr-2" />
              Chọn file CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upload History */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{item.filename}</h4>
                    <p className="text-sm text-slate-600">{item.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-slate-500">Ngày: {item.uploadDate}</span>
                      <span className="text-xs text-slate-500">Số bản ghi: {item.records}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={item.status === 'success' ? 'default' : 'secondary'}>
                    {item.status === 'success' ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Thành công
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Đang xử lý
                      </>
                    )}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Chi tiết
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
