import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Eye, 
  Download, 
  Calendar, 
  Phone, 
  MapPin, 
  User,
  Activity,
  FileText,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PatientManagementProps {
  userRole: string;
}

export const PatientManagement = ({ userRole }: PatientManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showConclusionDialog, setShowConclusionDialog] = useState(false);
  const [conclusion, setConclusion] = useState('');
  const isCollaborator = userRole === 'collaborator';
  const { toast } = useToast();

  const [patients] = useState([
    {
      id: 1,
      code: 'PT001',
      name: 'Nguyễn Văn A',
      age: 45,
      gender: 'Nam',
      phone: '0123456789',
      address: 'Hà Nội',
      assignedDoctor: 'BS. Trần Văn B',
      assignedDate: '2024-01-10',
      lastVisit: '2024-01-15',
      status: 'active',
      tests: [
        {
          id: 1,
          code: 'XN_240115_001',
          date: '2024-01-15',
          diagnosisTime: '2024-01-15 14:35:27',
          diagnosis: 'Tiểu đường type 2',
          riskScore: 85,
          biomarkers: {
            glucose: 180,
            hba1c: 8.5,
            cholesterol: 240
          },
          doctorConclusion: 'Bệnh nhân cần điều chỉnh chế độ ăn uống và dùng thuốc theo chỉ định'
        }
      ]
    },
    {
      id: 2,
      code: 'PT002',
      name: 'Trần Thị B',
      age: 38,
      gender: 'Nữ',
      phone: '0987654321',
      address: 'TP.HCM',
      assignedDoctor: 'BS. Nguyễn Thị C',
      assignedDate: '2024-01-12',
      lastVisit: '2024-01-14',
      status: 'active',
      tests: [
        {
          id: 2,
          code: 'XN_240114_002',
          date: '2024-01-14',
          diagnosisTime: '2024-01-14 10:22:15',
          diagnosis: 'Rối loạn lipid máu',
          riskScore: 65,
          biomarkers: {
            totalCholesterol: 220,
            ldl: 140,
            hdl: 45
          },
          doctorConclusion: ''
        }
      ]
    }
  ]);

  const handleReAnalyze = (patient: any, test: any) => {
    const newDiagnosisTime = new Date().toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    toast({
      title: "Phân tích lại hoàn tất",
      description: `Xét nghiệm ${test.code} của bệnh nhân ${patient.name} đã được phân tích lại`,
    });
    
    console.log('Phân tích lại:', {
      patientCode: patient.code,
      testCode: test.code,
      newDiagnosisTime,
      oldRiskScore: test.riskScore
    });
  };

  const handleSaveConclusion = (patient: any, test: any) => {
    toast({
      title: "Lưu kết luận thành công",
      description: `Kết luận cho bệnh nhân ${patient.name} đã được lưu`,
    });
    
    console.log('Lưu kết luận:', {
      patientCode: patient.code,
      testCode: test.code,
      conclusion
    });
    
    setShowConclusionDialog(false);
    setConclusion('');
  };

  const handleDownloadPDF = (patient: any) => {
    toast({
      title: "Tải xuống PDF",
      description: `Đang tạo file PDF cho bệnh nhân ${patient.name}`,
    });
    
    console.log('Download PDF for patient:', patient.code);
  };

  const handleDownloadCSV = (patient: any) => {
    const csvContent = `
Thông tin bệnh nhân
Mã bệnh nhân,${patient.code}
Họ tên,${patient.name}
Tuổi,${patient.age}
Giới tính,${patient.gender}
Số điện thoại,${patient.phone}
Địa chỉ,${patient.address}
Bác sĩ chỉ định,${patient.assignedDoctor}
Ngày phân công,${patient.assignedDate}

Kết quả xét nghiệm
${patient.tests.map((test: any) => `
Mã xét nghiệm,${test.code}
Ngày xét nghiệm,${test.date}
Thời gian chẩn đoán,${test.diagnosisTime}
Chẩn đoán,${test.diagnosis}
Điểm nguy cơ,${test.riskScore}
Kết luận bác sĩ,"${test.doctorConclusion || 'Chưa có kết luận'}"
`).join('\n')}
    `.trim();

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BenhNhan_${patient.code}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Tải xuống CSV thành công",
      description: `File CSV cho bệnh nhân ${patient.name} đã được tải xuống`,
    });
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý bệnh nhân</h2>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã bệnh nhân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="border border-slate-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{patient.name}</CardTitle>
                  <p className="text-sm text-slate-600">Mã BN: {patient.code}</p>
                </div>
                <div className="flex space-x-2">
                  <Badge variant={patient.status === 'active' ? "default" : "secondary"}>
                    {patient.status === 'active' ? 'Đang điều trị' : 'Ngưng điều trị'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-slate-500" />
                  <span>{patient.age} tuổi, {patient.gender}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-slate-500" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                  <span>{patient.address}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                  <span>Khám gần nhất: {patient.lastVisit}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-1">Bác sĩ chỉ định:</p>
                <p className="text-sm text-blue-700">{patient.assignedDoctor}</p>
                <p className="text-xs text-blue-600">Ngày phân công: {patient.assignedDate}</p>
              </div>

              {/* Latest Test Results */}
              {patient.tests.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-lg">
                  <h4 className="font-medium text-slate-800 mb-2">Kết quả xét nghiệm gần nhất</h4>
                  {patient.tests.map((test: any) => (
                    <div key={test.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{test.code}</span>
                          <span className="text-sm text-slate-600 ml-2">({test.date})</span>
                        </div>
                        <Badge variant="outline">
                          Điểm nguy cơ: {test.riskScore}
                        </Badge>
                      </div>
                      
                      {test.diagnosisTime && (
                        <div className="flex items-center text-xs text-green-600">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Thời gian chẩn đoán: {test.diagnosisTime}</span>
                        </div>
                      )}
                      
                      <p className="text-sm"><strong>Chẩn đoán:</strong> {test.diagnosis}</p>
                      
                      {test.doctorConclusion && (
                        <div className="bg-green-50 p-2 rounded text-sm">
                          <strong className="text-green-800">Kết luận bác sĩ:</strong>
                          <p className="text-green-700">{test.doctorConclusion}</p>
                        </div>
                      )}
                      
                      {/* Action buttons for each test */}
                      <div className="flex space-x-2 pt-2">
                        {!isCollaborator && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReAnalyze(patient, test)}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Phân tích lại
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            setSelectedPatient(patient);
                            setConclusion(test.doctorConclusion || '');
                            setShowConclusionDialog(true);
                          }}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          {test.doctorConclusion ? 'Sửa kết luận' : 'Nhập kết luận'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Download Actions */}
              <div className="flex space-x-2 pt-2 border-t border-slate-200">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDownloadPDF(patient)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Tải PDF
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDownloadCSV(patient)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Tải CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient Detail Dialog */}
      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết bệnh nhân - {selectedPatient.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Thông tin cơ bản</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Mã bệnh nhân:</strong> {selectedPatient.code}</p>
                    <p><strong>Họ tên:</strong> {selectedPatient.name}</p>
                    <p><strong>Tuổi:</strong> {selectedPatient.age}</p>
                    <p><strong>Giới tính:</strong> {selectedPatient.gender}</p>
                    <p><strong>Số điện thoại:</strong> {selectedPatient.phone}</p>
                    <p><strong>Địa chỉ:</strong> {selectedPatient.address}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Thông tin điều trị</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Bác sĩ chỉ định:</strong> {selectedPatient.assignedDoctor}</p>
                    <p><strong>Ngày phân công:</strong> {selectedPatient.assignedDate}</p>
                    <p><strong>Lần khám gần nhất:</strong> {selectedPatient.lastVisit}</p>
                    <p><strong>Trạng thái:</strong> 
                      <Badge className="ml-2">
                        {selectedPatient.status === 'active' ? 'Đang điều trị' : 'Ngưng điều trị'}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Lịch sử xét nghiệm</h3>
                <div className="space-y-4">
                  {selectedPatient.tests.map((test: any) => (
                    <Card key={test.id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{test.code}</h4>
                          <p className="text-sm text-slate-600">Ngày: {test.date}</p>
                          {test.diagnosisTime && (
                            <p className="text-xs text-green-600 flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              Chẩn đoán: {test.diagnosisTime}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline">
                          Điểm nguy cơ: {test.riskScore}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Chẩn đoán:</strong> {test.diagnosis}</p>
                        
                        <div>
                          <p className="text-sm font-medium mb-1">Chỉ số sinh học:</p>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {Object.entries(test.biomarkers).map(([key, value]) => (
                              <div key={key} className="bg-slate-50 p-2 rounded">
                                <div className="font-medium">{key.toUpperCase()}</div>
                                <div className="text-blue-600">{value as string}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {test.doctorConclusion && (
                          <div className="bg-green-50 p-3 rounded">
                            <p className="text-sm font-medium text-green-800">Kết luận bác sĩ:</p>
                            <p className="text-sm text-green-700">{test.doctorConclusion}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Conclusion Dialog */}
      {showConclusionDialog && selectedPatient && (
        <Dialog open={showConclusionDialog} onOpenChange={setShowConclusionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kết luận cuối cùng - {selectedPatient.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kết luận của bác sĩ:
                </label>
                <Textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="Nhập kết luận cuối cùng..."
                  rows={4}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleSaveConclusion(selectedPatient, selectedPatient.tests[0])}
                  disabled={!conclusion.trim()}
                >
                  Lưu kết luận
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConclusionDialog(false)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
