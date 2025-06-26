
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  LogOut, 
  Users, 
  FileText, 
  Search,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { PatientManagement } from './doctor/PatientManagement';
import { TestManagement } from './doctor/TestManagement';
import { ReportsView } from './doctor/ReportsView';

interface DoctorDashboardProps {
  user: {
    role: string;
    name: string;
    phone: string;
  };
  onLogout: () => void;
}

export const DoctorDashboard = ({ user, onLogout }: DoctorDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">SLSS Gentis</h1>
              <p className="text-sm text-slate-600">Hệ thống phân tích xét nghiệm</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-600">{user.role === 'doctor' ? 'Bác sĩ Gentis' : 'Bác sĩ cộng tác'}</p>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-73px)]">
          <nav className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
              <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-1">
                <TabsTrigger 
                  value="overview" 
                  className="w-full justify-start data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <TrendingUp className="h-4 w-4 mr-3" />
                  Tổng quan
                </TabsTrigger>
                <TabsTrigger 
                  value="patients" 
                  className="w-full justify-start data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <Users className="h-4 w-4 mr-3" />
                  Bệnh nhân
                </TabsTrigger>
                <TabsTrigger 
                  value="tests" 
                  className="w-full justify-start data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <Search className="h-4 w-4 mr-3" />
                  Xét nghiệm
                </TabsTrigger>
                <TabsTrigger 
                  value="reports" 
                  className="w-full justify-start data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Báo cáo
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bệnh nhân hôm nay</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+3 từ hôm qua</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Xét nghiệm chờ xử lý</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">Cần phân tích</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cảnh báo nguy cơ cao</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <p className="text-xs text-muted-foreground">Cần xem xét gấp</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">45</div>
                    <p className="text-xs text-muted-foreground">Tuần này</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cảnh báo nguy cơ cao gần đây</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">Nguyễn Văn A - #PT001</p>
                        <p className="text-sm text-slate-600">Nguy cơ cao: Tiểu đường type 2</p>
                      </div>
                      <Badge variant="destructive">Cao</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">Trần Thị B - #PT002</p>
                        <p className="text-sm text-slate-600">Nguy cơ trung bình: Rối loạn lipid</p>
                      </div>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">Trung bình</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">Lê Văn C - #PT003</p>
                        <p className="text-sm text-slate-600">Nguy cơ cao: Gan nhiễm mỡ</p>
                      </div>
                      <Badge variant="destructive">Cao</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Xét nghiệm mới nhất</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">XN_240101_001</p>
                        <p className="text-sm text-slate-600">Sinh hóa máu - 15 mẫu</p>
                      </div>
                      <Badge>Đã xử lý</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">XN_240101_002</p>
                        <p className="text-sm text-slate-600">Lipid profile - 8 mẫu</p>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">XN_240101_003</p>
                        <p className="text-sm text-slate-600">HbA1c - 12 mẫu</p>
                      </div>
                      <Badge>Đã xử lý</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="patients" className="mt-0">
              <PatientManagement />
            </TabsContent>

            <TabsContent value="tests" className="mt-0">
              <TestManagement />
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <ReportsView />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};
