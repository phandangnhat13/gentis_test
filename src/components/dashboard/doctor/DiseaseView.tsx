
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, FileText, Info } from 'lucide-react';

export const DiseaseView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<any>(null);
  const [viewType, setViewType] = useState<'detail' | 'summary'>('detail');

  const [diseases] = useState([
    {
      id: 1,
      code: 'D001',
      name: 'Tiểu đường type 2',
      classification: 'Bệnh nội tiết',
      description: 'Bệnh tiểu đường type 2 là một rối loạn chuyển hóa mãn tính...',
      symptoms: ['Khát nước nhiều', 'Tiểu nhiều', 'Mệt mỏi', 'Sụt cân'],
      diagnosis: 'Dựa vào xét nghiệm glucose máu đói, HbA1c...',
      treatment: 'Điều chỉnh chế độ ăn uống, tập thể dục, dùng thuốc...',
      summary: 'Bệnh tiểu đường type 2 gây ra do tế bào kháng insulin hoặc tuyến tụy không sản xuất đủ insulin.'
    },
    {
      id: 2,
      code: 'D002',
      name: 'Rối loạn lipid máu',
      classification: 'Bệnh tim mạch',
      description: 'Rối loạn lipid máu là tình trạng bất thường trong nồng độ lipid...',
      symptoms: ['Thường không có triệu chứng', 'Có thể đau ngực'],
      diagnosis: 'Xét nghiệm lipid máu, cholesterol total, LDL, HDL...',
      treatment: 'Thay đổi lối sống, thuốc hạ lipid máu...',
      summary: 'Rối loạn lipid máu tăng nguy cơ bệnh tim mạch, cần kiểm soát chế độ ăn và dùng thuốc.'
    },
    {
      id: 3,
      code: 'D003', 
      name: 'Gan nhiễm mỡ',
      classification: 'Bệnh gan',
      description: 'Gan nhiễm mỡ là tình trạng tích tụ mỡ trong tế bào gan...',
      symptoms: ['Mệt mỏi', 'Đau tức vùng gan', 'Khó tiêu'],
      diagnosis: 'Siêu âm gan, xét nghiệm men gan ALT, AST...',
      treatment: 'Giảm cân, hạn chế rượu bia, ăn uống lành mạnh...',
      summary: 'Gan nhiễm mỡ có thể tiến triển thành xơ gan nếu không điều trị kịp thời.'
    }
  ]);

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.classification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDisease = (disease: any, type: 'detail' | 'summary') => {
    setSelectedDisease(disease);
    setViewType(type);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Danh mục bệnh</h2>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 font-medium text-slate-600">Mã bệnh</th>
                  <th className="text-left p-3 font-medium text-slate-600">Tên bệnh</th>
                  <th className="text-left p-3 font-medium text-slate-600">Phân loại</th>
                  <th className="text-right p-3 font-medium text-slate-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredDiseases.map((disease) => (
                  <tr key={disease.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-mono text-sm font-medium text-red-600">{disease.code}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-800">{disease.name}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{disease.classification}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex space-x-2 justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDisease(disease, 'detail')}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Chi tiết
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDisease(disease, 'summary')}
                        >
                          <Info className="h-3 w-3 mr-1" />
                          Tóm tắt
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Disease Detail/Summary Dialog */}
      {selectedDisease && (
        <Dialog open={!!selectedDisease} onOpenChange={() => setSelectedDisease(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {viewType === 'detail' ? 'Chi tiết' : 'Tóm tắt'}: {selectedDisease.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Mã bệnh:</strong> {selectedDisease.code}
                </div>
                <div>
                  <strong>Phân loại:</strong> {selectedDisease.classification}
                </div>
              </div>
              
              {viewType === 'detail' ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Mô tả:</h3>
                    <p className="text-slate-700">{selectedDisease.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Triệu chứng:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedDisease.symptoms.map((symptom: string, index: number) => (
                        <li key={index} className="text-slate-700">{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Chẩn đoán:</h3>
                    <p className="text-slate-700">{selectedDisease.diagnosis}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Điều trị:</h3>
                    <p className="text-slate-700">{selectedDisease.treatment}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium mb-2">Tóm tắt:</h3>
                  <p className="text-slate-700">{selectedDisease.summary}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
