import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Download, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Activity,
  Calendar,
  Eye,
  X,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Biomarker {
  value: number;
  normal: string;
  status: 'high' | 'low' | 'normal';
}

interface Report {
  id: number;
  patientCode: string;
  patientName: string;
  testCode: string;
  date: string;
  testDateTime: string; // Precise date and time with seconds
  diagnosisDateTime: string; // When diagnosis was made
  riskLevel: 'high' | 'medium' | 'low';
  primaryDiagnosis: string;
  riskScore: number;
  recommendations: string[];
  biomarkers: Record<string, Biomarker>;
}

interface ReportsViewProps {
  userRole: string;
}

export const ReportsView = ({ userRole }: ReportsViewProps) => {
  const isCollaborator = userRole === 'collaborator';
  const [viewingReport, setViewingReport] = useState<Report | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState<Report | null>(null);
  const { toast } = useToast();
  
  const [reports] = useState<Report[]>(isCollaborator ? [
    {
      id: 3,
      patientCode: 'PT003',
      patientName: 'Lê Văn C',
      testCode: 'XN_240101_003',
      date: '2024-01-13',
      testDateTime: '2024-01-13 08:15:32',
      diagnosisDateTime: '2024-01-13 14:22:15',
      riskLevel: 'high',
      primaryDiagnosis: 'Gan nhiễm mỡ',
      riskScore: 78,
      recommendations: [
        'Giảm cân và tập thể dục đều đặn',
        'Hạn chế rượu bia hoàn toàn',
        'Theo dõi lại sau 3 tháng'
      ],
      biomarkers: {
        alt: { value: 85, normal: '7-56', status: 'high' },
        ast: { value: 72, normal: '10-40', status: 'high' },
        ggt: { value: 95, normal: '9-48', status: 'high' }
      }
    }
  ] : [
    {
      id: 1,
      patientCode: 'PT001',
      patientName: 'Nguyễn Văn A',
      testCode: 'XN_240101_001',
      date: '2024-01-15',
      testDateTime: '2024-01-15 09:30:45',
      diagnosisDateTime: '2024-01-15 16:45:22',
      riskLevel: 'high',
      primaryDiagnosis: 'Tiểu đường type 2',
      riskScore: 85,
      recommendations: [
        'Theo dõi đường huyết thường xuyên',
        'Làm thêm xét nghiệm HbA1c sau 3 tháng',
        'Chuyển khoa Nội tiết'
      ],
      biomarkers: {
        glucose: { value: 180, normal: '70-100', status: 'high' },
        hba1c: { value: 8.5, normal: '4-6', status: 'high' },
        cholesterol: { value: 240, normal: '<200', status: 'high' }
      }
    },
    {
      id: 2,
      patientCode: 'PT002',
      patientName: 'Trần Thị B',
      testCode: 'XN_240101_002',
      date: '2024-01-14',
      testDateTime: '2024-01-14 14:20:18',
      diagnosisDateTime: '2024-01-14 18:35:07',
      riskLevel: 'medium',
      primaryDiagnosis: 'Rối loạn lipid máu',
      riskScore: 65,
      recommendations: [
        'Điều chỉnh chế độ ăn uống',
        'Tăng cường vận động',
        'Theo dõi lại sau 6 tháng'
      ],
      biomarkers: {
        totalCholesterol: { value: 220, normal: '<200', status: 'high' },
        ldl: { value: 140, normal: '<100', status: 'high' },
        hdl: { value: 45, normal: '>40', status: 'normal' }
      }
    }
  ]);

  const handleExportPDF = (reportId: number) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      const pdfContent = `
        BÁAO CÁO CHẨN ĐOÁN XÉT NGHIỆM
        ================================
        
        Bệnh nhân: ${report.patientName} (${report.patientCode})
        Ngày xét nghiệm: ${report.testDateTime}
        Thời gian chẩn đoán: ${report.diagnosisDateTime}
        Mã xét nghiệm: ${report.testCode}
        
        CHẨN ĐOÁN CHÍNH: ${report.primaryDiagnosis}
        Điểm nguy cơ: ${report.riskScore}/100
        
        CÁC CHỈ SỐ SINH HỌC:
        ${Object.entries(report.biomarkers).map(([key, marker]) => 
          `- ${key.toUpperCase()}: ${marker.value} (Bình thường: ${marker.normal}) - ${marker.status === 'high' ? 'CAO' : marker.status === 'low' ? 'THẤP' : 'BÌNH THƯỜNG'}`
        ).join('\n        ')}
        
        KHUYẾN NGHỊ:
        ${report.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n        ')}
        
        ================================
        Báo cáo được tạo bởi SLSS Gentis
        Ngày tạo: ${new Date().toLocaleString('vi-VN')}
      `;

      const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BaoCao_${report.patientCode}_${report.date}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Xuất báo cáo thành công",
        description: `Báo cáo cho bệnh nhân ${report.patientName} đã được tải xuống`,
      });
      
      console.log('Xuất báo cáo PDF cho:', report.patientName);
    }
  };

  const handleExportAll = () => {
    const allReportsContent = reports.map(report => `
      BÁAO CÁO CHẨN ĐOÁN XÉT NGHIỆM
      ================================
      
      Bệnh nhân: ${report.patientName} (${report.patientCode})
      Ngày xét nghiệm: ${report.testDateTime}
      Thời gian chẩn đoán: ${report.diagnosisDateTime}
      Mã xét nghiệm: ${report.testCode}
      
      CHẨN ĐOÁN CHÍNH: ${report.primaryDiagnosis}
      Điểm nguy cơ: ${report.riskScore}/100
      
      CÁC CHỈ SỐ SINH HỌC:
      ${Object.entries(report.biomarkers).map(([key, marker]) => 
        `- ${key.toUpperCase()}: ${marker.value} (Bình thường: ${marker.normal}) - ${marker.status === 'high' ? 'CAO' : marker.status === 'low' ? 'THẤP' : 'BÌNH THƯỜNG'}`
      ).join('\n      ')}
      
      KHUYẾN NGHỊ:
      ${report.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n      ')}
      
      ================================
    `).join('\n\n');

    const finalContent = allReportsContent + `
      \n\nTÓM TẮT THỐNG KÊ:
      - Tổng số báo cáo: ${reports.length}
      - Nguy cơ cao: ${reports.filter(r => r.riskLevel === 'high').length}
      - Nguy cơ trung bình: ${reports.filter(r => r.riskLevel === 'medium').length}
      - Nguy cơ thấp: ${reports.filter(r => r.riskLevel === 'low').length}
      
      Báo cáo được tạo bởi SLSS Gentis
      Ngày tạo: ${new Date().toLocaleString('vi-VN')}
    `;

    const blob = new Blob([finalContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TongHopBaoCao_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Xuất tất cả báo cáo",
      description: `Đã xuất ${reports.length} báo cáo thành công`,
    });
    
    console.log('Xuất tất cả báo cáo');
  };

  const handleScheduleAppointment = (report: Report, appointmentData: any) => {
    toast({
      title: "Lên lịch tái khám thành công",
      description: `Đã lên lịch tái khám cho bệnh nhân ${report.patientName} vào ${appointmentData.date}`,
    });
    
    console.log('Lên lịch tái khám:', {
      patient: report.patientName,
      ...appointmentData
    });
    
    setShowScheduleDialog(null);
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge variant="destructive">Nguy cơ cao</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Nguy cơ trung bình</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Nguy cơ thấp</Badge>;
      default:
        return <Badge variant="secondary">Chưa đánh giá</Badge>;
    }
  };

  const getBiomarkerStatus = (status: string) => {
    switch (status) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      case 'normal':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          {isCollaborator ? 'Báo cáo chẩn đoán - Bệnh nhân được phân công' : 'Báo cáo phân tích'}
        </h2>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleExportAll}>
          <Download className="h-4 w-4 mr-2" />
          Xuất tất cả báo cáo
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Nguy cơ cao</p>
                <p className="text-2xl font-bold text-red-600">
                  {reports.filter(r => r.riskLevel === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Nguy cơ trung bình</p>
                <p className="text-2xl font-bold text-orange-600">
                  {reports.filter(r => r.riskLevel === 'medium').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">
                  {isCollaborator ? 'BN được phân công' : 'Tổng bệnh nhân'}
                </p>
                <p className="text-2xl font-bold text-blue-600">{reports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">Độ chính xác</p>
                <p className="text-2xl font-bold text-green-600">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Reports */}
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="border border-slate-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{report.patientName}</CardTitle>
                  <p className="text-sm text-slate-600">
                    {report.patientCode} • {report.testCode}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>XN: {report.testDateTime}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      <span>CĐ: {report.diagnosisDateTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right mr-3">
                    <p className="text-sm text-slate-600">Điểm nguy cơ</p>
                    <p className="text-xl font-bold text-red-600">{report.riskScore}/100</p>
                  </div>
                  {getRiskBadge(report.riskLevel)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Diagnosis */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Chẩn đoán chính được gợi ý</h4>
                <p className="text-blue-700 font-medium">{report.primaryDiagnosis}</p>
              </div>

              {/* Biomarkers */}
              <div>
                <h4 className="font-medium text-slate-800 mb-3">Chỉ số sinh học</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(report.biomarkers).map(([key, marker]) => (
                    <div key={key} className={`p-3 rounded-lg ${getBiomarkerStatus(marker.status)}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-xs">{marker.normal}</span>
                      </div>
                      <p className="text-lg font-bold">{marker.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-slate-800 mb-3">Khuyến nghị xử lý</h4>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {report.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm text-slate-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-slate-200">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setViewingReport(report)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Xem chi tiết
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleExportPDF(report.id)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Xuất PDF
                </Button>
                {!isCollaborator && (
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowScheduleDialog(report)}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Lên lịch tái khám
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Report Detail Dialog */}
      {viewingReport && (
        <Dialog open={!!viewingReport} onOpenChange={() => setViewingReport(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Chi tiết báo cáo - {viewingReport.patientName}</DialogTitle>
                <Button variant="outline" size="sm" onClick={() => setViewingReport(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            <ReportDetailView report={viewingReport} />
          </DialogContent>
        </Dialog>
      )}

      {/* Schedule Appointment Dialog */}
      {showScheduleDialog && (
        <Dialog open={!!showScheduleDialog} onOpenChange={() => setShowScheduleDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lên lịch tái khám - {showScheduleDialog.patientName}</DialogTitle>
            </DialogHeader>
            <ScheduleAppointmentForm 
              report={showScheduleDialog}
              onSchedule={handleScheduleAppointment}
              onCancel={() => setShowScheduleDialog(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Report Detail View Component
const ReportDetailView = ({ report }: { report: Report }) => {
  return (
    <div className="space-y-6">
      {/* Patient Info */}
      <div className="bg-slate-50 p-4 rounded-lg">
        <h3 className="font-semibold text-slate-800 mb-3">Thông tin bệnh nhân</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Họ tên:</label>
            <p className="font-medium">{report.patientName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Mã bệnh nhân:</label>
            <p className="font-medium">{report.patientCode}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Mã xét nghiệm:</label>
            <p className="font-medium">{report.testCode}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Thời gian xét nghiệm:</label>
            <p className="font-medium">{report.testDateTime}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Thời gian chẩn đoán:</label>
            <p className="font-medium">{report.diagnosisDateTime}</p>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="font-semibold text-red-800 mb-3">Đánh giá nguy cơ</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-600">Mức độ nguy cơ</p>
            <p className="text-2xl font-bold text-red-700">{report.riskScore}/100</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-red-600">Phân loại</p>
            <div className="mt-1">
              {report.riskLevel === 'high' && <Badge variant="destructive">Nguy cơ cao</Badge>}
              {report.riskLevel === 'medium' && <Badge className="bg-orange-100 text-orange-800">Trung bình</Badge>}
              {report.riskLevel === 'low' && <Badge className="bg-green-100 text-green-800">Thấp</Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Biomarkers */}
      <div>
        <h3 className="font-semibold text-slate-800 mb-3">Chi tiết các chỉ số sinh học</h3>
        <div className="space-y-3">
          {Object.entries(report.biomarkers).map(([key, marker]) => (
            <div key={key} className="border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                <Badge variant={marker.status === 'high' ? 'destructive' : marker.status === 'low' ? 'secondary' : 'default'}>
                  {marker.status === 'high' ? 'Cao' : marker.status === 'low' ? 'Thấp' : 'Bình thường'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Giá trị đo được:</span>
                  <p className="font-semibold text-lg">{marker.value}</p>
                </div>
                <div>
                  <span className="text-slate-600">Khoảng bình thường:</span>
                  <p className="font-medium">{marker.normal}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnosis and Recommendations */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-3">Chẩn đoán và khuyến nghị</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-blue-600">Chẩn đoán chính:</label>
            <p className="font-semibold text-blue-800 text-lg">{report.primaryDiagnosis}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-blue-600">Khuyến nghị xử lý:</label>
            <ul className="mt-2 space-y-2">
              {report.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-blue-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Schedule Appointment Form Component
const ScheduleAppointmentForm = ({ 
  report, 
  onSchedule, 
  onCancel 
}: { 
  report: Report; 
  onSchedule: (report: Report, data: any) => void; 
  onCancel: () => void; 
}) => {
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    department: '',
    doctor: '',
    notes: ''
  });

  const handleSchedule = () => {
    if (appointmentData.date && appointmentData.time && appointmentData.department) {
      onSchedule(report, appointmentData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Ngày tái khám</Label>
          <Input
            id="date"
            type="date"
            value={appointmentData.date}
            onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="time">Giờ khám</Label>
          <Input
            id="time"
            type="time"
            value={appointmentData.time}
            onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="department">Khoa khám</Label>
        <Input
          id="department"
          placeholder="Ví dụ: Khoa Nội tiết"
          value={appointmentData.department}
          onChange={(e) => setAppointmentData({...appointmentData, department: e.target.value})}
        />
      </div>
      
      <div>
        <Label htmlFor="doctor">Bác sĩ khám (tùy chọn)</Label>
        <Input
          id="doctor"
          placeholder="Tên bác sĩ"
          value={appointmentData.doctor}
          onChange={(e) => setAppointmentData({...appointmentData, doctor: e.target.value})}
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Ghi chú</Label>
        <Textarea
          id="notes"
          placeholder="Ghi chú thêm về lịch hẹn..."
          value={appointmentData.notes}
          onChange={(e) => setAppointmentData({...appointmentData, notes: e.target.value})}
        />
      </div>
      
      <div className="flex space-x-2 pt-4">
        <Button 
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={handleSchedule}
          disabled={!appointmentData.date || !appointmentData.time || !appointmentData.department}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Lên lịch
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Hủy
        </Button>
      </div>
    </div>
  );
};
