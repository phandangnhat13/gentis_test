
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye } from 'lucide-react';

export const DiseaseView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<any>(null);
  
  const [diseases] = useState([
    {
      id: 1,
      name: 'Tiểu đường type 2',
      code: 'E11',
      category: 'Nội tiết',
      riskLevel: 'high',
      biomarkers: ['Glucose', 'HbA1c', 'Insulin'],
      description: 'Bệnh tiểu đường type 2 là tình trạng mức đường huyết cao do cơ thể không sản xuất đủ insulin hoặc không sử dụng insulin hiệu quả.',
      symptoms: ['Khát nước nhiều', 'Tiểu nhiều', 'Mệt mỏi', 'Giảm cân không rõ nguyên nhân'],
      treatment: 'Điều chỉnh chế độ ăn uống, tập thể dục, thuốc hạ đường huyết, insulin nếu cần thiết.'
    },
    {
      id: 2,
      name: 'Rối loạn lipid máu',
      code: 'E78',
      category: 'Tim mạch',
      riskLevel: 'medium',
      biomarkers: ['Total Cholesterol', 'LDL', 'HDL', 'Triglycerides'],
      description: 'Rối loạn lipid máu là tình trạng bất thường của các chất béo trong máu, có thể dẫn đến bệnh tim mạch.',
      symptoms: ['Thường không có triệu chứng', 'Có thể xuất hiện u mỡ dưới da'],
      treatment: 'Thay đổi lối sống, chế độ ăn ít béo, tập thể dục, thuốc statin nếu cần.'
    },
    {
      id: 3,
      name: 'Gan nhiễm mỡ',
      code: 'K76.0',
      category: 'Tiêu hóa',
      riskLevel: 'medium',
      biomarkers: ['ALT', 'AST', 'GGT', 'ALP'],
      description: 'Gan nhiễm mỡ là tình trạng tích tụ mỡ trong tế bào gan, có thể dẫn đến viêm gan và xơ gan.',
      symptoms: ['Mệt mỏi', 'Đau tức vùng gan', 'Khó tiêu'],
      treatment: 'Giảm cân, tập thể dục, hạn chế rượu bia, điều trị bệnh lý kết hợp.'
    },
    {
      id: 4,
      name: 'Tăng huyết áp',
      code: 'I10',
      category: 'Tim mạch',
      riskLevel: 'high',
      biomarkers: ['Sodium', 'Potassium', 'Creatinine'],
      description: 'Tăng huyết áp là tình trạng áp lực máu trong động mạch cao hơn bình thường.',
      symptoms: ['Đau đầu', 'Chóng mặt', 'Ù tai', 'Mệt mỏi'],
      treatment: 'Thay đổi lối sống, thuốc hạ áp, theo dõi thường xuyên.'
    }
  ]);

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge variant="destructive">Nguy cơ cao</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Nguy cơ trung bình</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Nguy cơ thấp</Badge>;
      default:
        return <Badge variant="secondary">Chưa phân loại</Badge>;
    }
  };

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Danh sách bệnh</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo tên bệnh, mã ICD, chuyên khoa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã ICD</TableHead>
                <TableHead>Tên bệnh</TableHead>
                <TableHead>Chuyên khoa</TableHead>
                <TableHead>Mức độ nguy cơ</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDiseases.map((disease) => (
                <TableRow key={disease.id}>
                  <TableCell className="font-mono">{disease.code}</TableCell>
                  <TableCell className="font-medium">{disease.name}</TableCell>
                  <TableCell>{disease.category}</TableCell>
                  <TableCell>{getRiskBadge(disease.riskLevel)}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedDisease(disease)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Disease Detail Dialog */}
      {selectedDisease && (
        <Dialog open={!!selectedDisease} onOpenChange={() => setSelectedDisease(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedDisease.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Thông tin cơ bản</h4>
                <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                  <div><strong>Mã ICD:</strong> {selectedDisease.code}</div>
                  <div><strong>Chuyên khoa:</strong> {selectedDisease.category}</div>
                  <div className="flex items-center"><strong>Mức độ nguy cơ:</strong> <span className="ml-2">{getRiskBadge(selectedDisease.riskLevel)}</span></div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Mô tả</h4>
                <p className="text-sm text-slate-700">{selectedDisease.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Triệu chứng thường gặp</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  {selectedDisease.symptoms.map((symptom: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Hướng điều trị</h4>
                <p className="text-sm text-slate-700">{selectedDisease.treatment}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Chỉ số sinh học liên quan</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDisease.biomarkers.map((marker: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {marker}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
