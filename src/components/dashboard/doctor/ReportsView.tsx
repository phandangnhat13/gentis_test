import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Activity,
  Calendar
} from 'lucide-react';

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
  
  const [reports] = useState<Report[]>(isCollaborator ? [
    {
      id: 3,
      patientCode: 'PT003',
      patientName: 'Lê Văn C',
      testCode: 'XN_240101_003',
      date: '2024-01-13',
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
      // Tạo nội dung PDF
      const pdfContent = `
        BÁAO CÁO CHẨN ĐOÁN XÉT NGHIỆM
        ================================
        
        Bệnh nhân: ${report.patientName} (${report.patientCode})
        Ngày xét nghiệm: ${report.date}
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
        Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}
      `;

      // Tạo và tải xuống file
      const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BaoCao_${report.patientCode}_${report.date}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Xuất báo cáo PDF cho:', report.patientName);
    }
  };

  const handleExportAll = () => {
    const allReportsContent = reports.map(report => `
      BÁAO CÁO CHẨN ĐOÁN XÉT NGHIỆM
      ================================
      
      Bệnh nhân: ${report.patientName} (${report.patientCode})
      Ngày xét nghiệm: ${report.date}
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
      Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}
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
    
    console.log('Xuất tất cả báo cáo');
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
                    {report.patientCode} • {report.testCode} • {report.date}
                  </p>
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
                <Button size="sm" variant="outline" className="flex-1">
                  <FileText className="h-3 w-3 mr-1" />
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
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Calendar className="h-3 w-3 mr-1" />
                    Lên lịch tái khám
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
