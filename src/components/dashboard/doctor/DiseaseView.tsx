
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Eye,
  Info
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const DiseaseView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<any>(null);
  const [viewType, setViewType] = useState<'detail' | 'summary'>('detail');

  // Your specific disease data
  const [diseases] = useState([
    {
      id: 1,
      code: 'D001',
      name: 'Isovaleric acidemia (isovaleryl-CoA dehydrogenase)',
      description: 'Rối loạn chuyển hóa axit amin do thiếu hụt enzyme isovaleryl-CoA dehydrogenase, dẫn đến tích tụ axit isovaleric.',
      symptoms: ['Mùi chân đặc trưng', 'Nôn mửa', 'Hôn mê', 'Chậm phát triển'],
      diagnosis: 'Xét nghiệm tandem mass spectrometry, phát hiện tăng C5 (isovalerylcarnitine)',
      treatment: 'Chế độ ăn hạn chế leucine, bổ sung glycine và carnitine',
      summary: 'Bệnh chuyển hóa hiếm gặp do thiếu enzyme isovaleryl-CoA dehydrogenase, có thể gây nguy hiểm tính mạng nếu không điều trị.'
    },
    {
      id: 2,
      code: 'D002', 
      name: 'Glutaric acidemia type I (glutaryl-CoA dehydrogenase)',
      description: 'Rối loạn chuyển hóa do thiếu hụt enzyme glutaryl-CoA dehydrogenase, gây tích tụ axit glutaric.',
      symptoms: ['Đầu to', 'Chậm phát triển vận động', 'Rối loạn thần kinh', 'Co giật'],
      diagnosis: 'Xét nghiệm tandem MS, tăng glutarylcarnitine, phân tích nước tiểu',
      treatment: 'Chế độ ăn hạn chế lysine và tryptophan, bổ sung carnitine và riboflavin',
      summary: 'Bệnh chuyển hóa ảnh hưởng đến não bộ, cần chẩn đoán và điều trị sớm để tránh tổn thương não vĩnh viễn.'
    },
    {
      id: 3,
      code: 'D003',
      name: '3-Hydroxy-3-methylglutaric acidemia (3-hydroxy-3-methylglutaryl-CoA lyase)',
      description: 'Rối loạn chuyển hóa ketone và leucine do thiếu hụt enzyme HMG-CoA lyase.',
      symptoms: ['Hạ đường huyết không ketone', 'Nôn mửa', 'Hôn mê', 'Suy thở'],
      diagnosis: 'Tăng 3-hydroxy-3-methylglutamic acid trong nước tiểu, hạ đường huyết',
      treatment: 'Tránh nhịn ăn, glucose IV khi cấp cứu, chế độ ăn ít chất béo',
      summary: 'Bệnh chuyển hóa nguy hiểm có thể gây hạ đường huyết nặng và tử vong nếu không điều trị kịp thời.'
    },
    {
      id: 4,
      code: 'D004',
      name: 'Holocarboxylase synthetase (multiple carboxylase) deficiency',
      description: 'Thiếu hụt enzyme holocarboxylase synthetase, ảnh hưởng đến nhiều carboxylase.',
      symptoms: ['Phát ban da', 'Rụng tóc', 'Chậm phát triển', 'Axit hóa máu'],
      diagnosis: 'Tăng các axit hữu cơ trong nước tiểu, giảm hoạt độ carboxylase',
      treatment: 'Bổ sung biotin liều cao, theo dõi định kỳ',
      summary: 'Bệnh thiếu hụt biotin bẩm sinh, đáp ứng tốt với điều trị bổ sung biotin.'
    },
    {
      id: 5,
      code: 'D005',
      name: 'Methylmalonic acidemia (methylmalonyl-CoA mutase)',
      description: 'Rối loạn chuyển hóa do thiếu hụt enzyme methylmalonyl-CoA mutase.',
      symptoms: ['Nôn mửa', 'Axit hóa máu', 'Chậm phát triển', 'Suy thận'],
      diagnosis: 'Tăng methylmalonic acid trong máu và nước tiểu, tăng C3',
      treatment: 'Chế độ ăn hạn chế protein, bổ sung vitamin B12, carnitine',
      summary: 'Bệnh chuyển hóa nghiêm trọng cần điều trị dinh dưỡng và theo dõi chặt chẽ.'
    },
    {
      id: 6,
      code: 'D006',
      name: '3-Methylcrotonyl-CoA Carboxylase Deficiency',
      description: 'Thiếu hụt enzyme 3-methylcrotonyl-CoA carboxylase trong chuyển hóa leucine.',
      symptoms: ['Chậm phát triển', 'Yếu cơ', 'Rối loạn thần kinh nhẹ'],
      diagnosis: 'Tăng 3-methylcrotonylglycine trong nước tiểu, tăng C5OH',
      treatment: 'Chế độ ăn hạn chế leucine, bổ sung carnitine và biotin',
      summary: 'Bệnh chuyển hóa tương đối nhẹ, nhiều trường hợp không có triệu chứng.'
    },
    {
      id: 7,
      code: 'D007',
      name: 'Methylmalonic acidemia (cbl disorders)',
      description: 'Rối loạn chuyển hóa vitamin B12, ảnh hưởng đến methylmalonyl-CoA mutase.',
      symptoms: ['Thiếu máu megaloblastic', 'Chậm phát triển', 'Rối loạn thần kinh'],
      diagnosis: 'Tăng methylmalonic acid, homocysteine, giảm methionine',
      treatment: 'Bổ sung vitamin B12 dạng hydroxocobalamin hoặc cyanocobalamin',
      summary: 'Nhóm bệnh liên quan đến chuyển hóa vitamin B12, đáp ứng tốt với điều trị bổ sung B12.'
    },
    {
      id: 8,
      code: 'D008',
      name: 'Propionic acidemia (propionyl-CoA carboxylase)',
      description: 'Thiếu hụt enzyme propionyl-CoA carboxylase, gây tích tụ axit propionic.',
      symptoms: ['Nôn mửa', 'Hôn mê', 'Axit hóa máu', 'Chậm phát triển'],
      diagnosis: 'Tăng propionic acid, 3-hydroxypropionate, tăng C3',
      treatment: 'Chế độ ăn hạn chế protein, bổ sung carnitine và biotin',
      summary: 'Bệnh chuyển hóa nghiêm trọng, cần chẩn đoán và điều trị sớm.'
    },
    {
      id: 9,
      code: 'D009',
      name: 'β-Ketothiolase deficiency (Beta-ketothiolase) (Mitochondriai Acetoacelyi-CoA Thiolase Deficiency)',
      description: 'Thiếu hụt enzyme mitochondrial acetoacetyl-CoA thiolase.',
      symptoms: ['Axit hóa máu ketone', 'Nôn mửa', 'Hôn mê', 'Chậm phát triển'],
      diagnosis: 'Tăng 2-methyl-3-hydroxybutyric acid, tiglylglycine',
      treatment: 'Tránh nhịn ăn, glucose khi cấp cứu, chế độ ăn đều đặn',
      summary: 'Bệnh chuyển hóa ketone, có thể gây axit hóa máu nghiêm trọng.'
    },
    {
      id: 10,
      code: 'D010',
      name: 'Methylmalonic acidemia with homocystinuria (methylmalonyl-CoA mutase and homocysteine: MTHF methyl transferase)',
      description: 'Rối loạn phối hợp chuyển hóa methylmalonic acid và homocysteine.',
      symptoms: ['Thiếu máu megaloblastic', 'Chậm phát triển', 'Rối loạn thần kinh', 'Huyết khối'],
      diagnosis: 'Tăng cả methylmalonic acid và homocysteine, giảm methionine',
      treatment: 'Bổ sung vitamin B12, folate, betaine, chế độ ăn hạn chế methionine',
      summary: 'Bệnh phức tạp ảnh hưởng đến nhiều con đường chuyển hóa, cần điều trị đa dạng.'
    },
    {
      id: 11,
      code: 'D011',
      name: 'Methylmalonic acidemia with homocystinuria (MMADHC protein)',
      description: 'Rối loạn do đột biến gen MMADHC, ảnh hưởng đến chuyển hóa vitamin B12.',
      symptoms: ['Thiếu máu megaloblastic', 'Suy thận', 'Rối loạn thần kinh', 'Bệnh mắt'],
      diagnosis: 'Tăng methylmalonic acid và homocysteine, phân tích gen MMADHC',
      treatment: 'Bổ sung hydroxocobalamin, folate, betaine',
      summary: 'Dạng hiếm của bệnh chuyển hóa B12, tiên lượng thường nghiêm trọng.'
    },
    {
      id: 12,
      code: 'D012',
      name: 'Malonic acidemia (malonyl-CoA decarboxylase)',
      description: 'Thiếu hụt enzyme malonyl-CoA decarboxylase, gây tích tụ axit malonic.',
      symptoms: ['Chậm phát triển', 'Rối loạn thần kinh', 'Co giật', 'Axit hóa máu nhẹ'],
      diagnosis: 'Tăng malonic acid trong nước tiểu, có thể tăng C3DC',
      treatment: 'Chế độ ăn đều đặn, tránh nhịn ăn, theo dõi phát triển',
      summary: 'Bệnh chuyển hóa hiếm gặp với triệu chứng thường nhẹ đến trung bình.'
    },
    {
      id: 13,
      code: 'D013',
      name: 'Isobutyrylglycinuria (isobutyryl-CoA dehydrogenase)',
      description: 'Thiếu hụt enzyme isobutyryl-CoA dehydrogenase trong chuyển hóa valine.',
      symptoms: ['Thường không triệu chứng', 'Có thể chậm phát triển nhẹ'],
      diagnosis: 'Tăng isobutyrylglycine trong nước tiểu, có thể tăng C4',
      treatment: 'Thường không cần điều trị đặc biệt, theo dõi định kỳ',
      summary: 'Bệnh chuyển hóa lành tính, hầu hết trường hợp không có triệu chứng.'
    },
    {
      id: 14,
      code: 'D014',
      name: '2-Methyl-3-hydroxybutyric acidemia (2-methyl-3-hydroxybutyryl-CoA dehydrogenase)',
      description: 'Thiếu hụt enzyme 2-methyl-3-hydroxybutyryl-CoA dehydrogenase.',
      symptoms: ['Chậm phát triển', 'Rối loạn thần kinh nhẹ', 'Có thể không triệu chứng'],
      diagnosis: 'Tăng 2-methyl-3-hydroxybutyric acid trong nước tiểu',
      treatment: 'Theo dõi định kỳ, chế độ ăn cân bằng',
      summary: 'Bệnh chuyển hóa hiếm gặp với triệu chứng thường nhẹ.'
    },
    {
      id: 15,
      code: 'D015',
      name: '2-Methylbutyrylglycinuria (2-methylbutyryl-CoA dehydrogenase)',
      description: 'Thiếu hụt enzyme 2-methylbutyryl-CoA dehydrogenase trong chuyển hóa isoleucine.',
      symptoms: ['Thường không triệu chứng', 'Có thể chậm phát triển nhẹ'],
      diagnosis: 'Tăng 2-methylbutyrylglycine trong nước tiểu',
      treatment: 'Thường không cần điều trị, theo dõi định kỳ',
      summary: 'Bệnh chuyển hóa lành tính, hiếm khi gây triệu chứng lâm sàng.'
    },
    {
      id: 16,
      code: 'D016',
      name: '3-Methylglutaconic acidemia type I (3-methylglutaconyl-CoA hydratase)',
      description: 'Thiếu hụt enzyme 3-methylglutaconyl-CoA hydratase trong chuyển hóa leucine.',
      symptoms: ['Chậm phát triển', 'Rối loạn thần kinh', 'Axit hóa máu nhẹ'],
      diagnosis: 'Tăng 3-methylglutaconic acid và 3-methylglutaric acid trong nước tiểu',
      treatment: 'Chế độ ăn hạn chế leucine, bổ sung carnitine',
      summary: 'Dạng nhẹ nhất trong nhóm bệnh 3-methylglutaconic acidemia.'
    }
  ]);

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.code.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm theo tên bệnh hoặc mã bệnh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Disease Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bệnh ({filteredDiseases.length} bệnh)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã bệnh</TableHead>
                <TableHead>Tên bệnh</TableHead>
                <TableHead>Mô tả ngắn</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDiseases.map((disease) => (
                <TableRow key={disease.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {disease.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {disease.name}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {disease.description.substring(0, 100)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDisease(disease, 'detail')}
                      >
                        <Eye className="h-3 w-3 mr-1" />
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Disease Details Dialog */}
      {selectedDisease && (
        <Dialog open={!!selectedDisease} onOpenChange={() => setSelectedDisease(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {viewType === 'detail' ? 'Thông tin chi tiết' : 'Tóm tắt'}: {selectedDisease.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
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
