
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface TestAnalysisProps {
  userRole: string;
}

export const TestAnalysis = ({ userRole }: TestAnalysisProps) => {
  const [dateRange, setDateRange] = useState('30days');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const { toast } = useToast();

  // Sample data for charts
  const monthlyData = [
    { month: 'T1', tests: 120, positive: 85, negative: 35 },
    { month: 'T2', tests: 135, positive: 92, negative: 43 },
    { month: 'T3', tests: 150, positive: 108, negative: 42 },
    { month: 'T4', tests: 128, positive: 89, negative: 39 },
    { month: 'T5', tests: 165, positive: 115, negative: 50 },
    { month: 'T6', tests: 142, positive: 98, negative: 44 },
  ];

  const diseaseData = [
    { name: 'Tiểu đường type 2', value: 35, color: '#8884d8' },
    { name: 'Tăng huyết áp', value: 28, color: '#82ca9d' },
    { name: 'Rối loạn lipid máu', value: 22, color: '#ffc658' },
    { name: 'Gan nhiễm mỡ', value: 15, color: '#ff7300' },
  ];

  const doctorPerformance = [
    { doctor: 'BS. Nguyễn A', accuracy: 94.5, tests: 85 },
    { doctor: 'BS. Trần B', accuracy: 92.3, tests: 78 },
    { doctor: 'BS. Lê C', accuracy: 96.1, tests: 92 },
    { doctor: 'BS. Phạm D', accuracy: 89.7, tests: 65 },
  ];

  const handleExportData = (type: 'excel' | 'pdf') => {
    const exportData = {
      dateRange,
      totalTests: monthlyData.reduce((sum, item) => sum + item.tests, 0),
      totalPositive: monthlyData.reduce((sum, item) => sum + item.positive, 0),
      totalNegative: monthlyData.reduce((sum, item) => sum + item.negative, 0),
      monthlyBreakdown: monthlyData,
      diseaseDistribution: diseaseData,
      doctorPerformance,
      exportDate: new Date().toLocaleDateString('vi-VN'),
      exportedBy: userRole === 'collaborator' ? 'Bác sĩ Cộng tác' : 'Bác sĩ Chính'
    };

    const content = `
BÁO CÁO PHÂN TÍCH SỐ LIỆU XÉT NGHIỆM
=====================================

Thời gian báo cáo: ${dateRange === '30days' ? '30 ngày qua' : dateRange === '90days' ? '90 ngày qua' : 'Năm nay'}
Ngày xuất báo cáo: ${exportData.exportDate}
Người xuất báo cáo: ${exportData.exportedBy}

PHÂN TÍCH THEO THÁNG:
${monthlyData.map(item => `- ${item.month}: ${item.tests} xét nghiệm (${item.positive} dương tính, ${item.negative} âm tính)`).join('\n')}

PHÂN BỐ BỆNH:
${diseaseData.map(item => `- ${item.name}: ${item.value}%`).join('\n')}

HIỆU SUẤT BÁC SĨ:
${doctorPerformance.map(item => `- ${item.doctor}: ${item.accuracy}% độ chính xác (${item.tests} xét nghiệm)`).join('\n')}

=====================================
Báo cáo được tạo bởi SLSS Gentis
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BaoCaoPhunTich_${new Date().toISOString().split('T')[0]}.${type === 'excel' ? 'txt' : 'txt'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Xuất báo cáo thành công",
      description: `Báo cáo phân tích đã được xuất dưới dạng ${type.toUpperCase()}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Phân tích số liệu</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => handleExportData('excel')}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleExportData('pdf')}
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-48">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Chọn thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">30 ngày qua</SelectItem>
                <SelectItem value="90days">90 ngày qua</SelectItem>
                <SelectItem value="year">Năm nay</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Chọn bác sĩ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả bác sĩ</SelectItem>
                <SelectItem value="doctor1">BS. Nguyễn A</SelectItem>
                <SelectItem value="doctor2">BS. Trần B</SelectItem>
                <SelectItem value="doctor3">BS. Lê C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Xu hướng xét nghiệm theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tests" stroke="#8884d8" name="Tổng XN" />
                <Line type="monotone" dataKey="positive" stroke="#82ca9d" name="Dương tính" />
                <Line type="monotone" dataKey="negative" stroke="#ffc658" name="Âm tính" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Disease Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Phân bố bệnh được phát hiện
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diseaseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {diseaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Doctor Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="h-5 w-5 mr-2" />
              Hiệu suất bác sĩ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={doctorPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="doctor" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="accuracy" fill="#8884d8" name="Độ chính xác (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              So sánh theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="positive" stackId="a" fill="#82ca9d" name="Dương tính" />
                <Bar dataKey="negative" stackId="a" fill="#8884d8" name="Âm tính" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-300 p-2 text-left">Bác sĩ</th>
                  <th className="border border-slate-300 p-2 text-center">Số XN</th>
                  <th className="border border-slate-300 p-2 text-center">Dương tính</th>
                  <th className="border border-slate-300 p-2 text-center">Âm tính</th>
                  <th className="border border-slate-300 p-2 text-center">Độ chính xác</th>
                  <th className="border border-slate-300 p-2 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {doctorPerformance.map((doctor, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="border border-slate-300 p-2 font-medium">{doctor.doctor}</td>
                    <td className="border border-slate-300 p-2 text-center">{doctor.tests}</td>
                    <td className="border border-slate-300 p-2 text-center">{Math.round(doctor.tests * 0.7)}</td>
                    <td className="border border-slate-300 p-2 text-center">{Math.round(doctor.tests * 0.3)}</td>
                    <td className="border border-slate-300 p-2 text-center">{doctor.accuracy}%</td>
                    <td className="border border-slate-300 p-2 text-center">
                      <Badge variant={doctor.accuracy > 90 ? "default" : "secondary"}>
                        {doctor.accuracy > 90 ? "Tốt" : "Cần cải thiện"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
