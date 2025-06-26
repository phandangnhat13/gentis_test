
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Upload, 
  FileText, 
  LogOut, 
  Settings,
  Database,
  Activity,
  Bell,
  UserCheck
} from 'lucide-react';
import { UserManagement } from './admin/UserManagement';
import { DiseaseManagement } from './admin/DiseaseManagement';
import { DataUpload } from './admin/DataUpload';
import { PatientAssignment } from './admin/PatientAssignment';

interface AdminDashboardProps {
  user: {
    role: string;
    name: string;
    phone: string;
  };
  onLogout: () => void;
}

export const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-red-600 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">SLSS Gentis - Admin</h1>
              <p className="text-sm text-slate-600">Quản trị hệ thống</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="h-5 w-5 text-slate-400" />
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-600">{user.phone}</p>
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
                  className="w-full justify-start data-[state=active]:bg-red-50 data-[state=active]:text-red-700"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Tổng quan
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="w-full justify-start data-[state=active]:bg-red-50 data-[state=active]:text-red-700"
                >
                  <Users className="h-4 w-4 mr-3" />
                  Quản lý người dùng
                </TabsTrigger>
                <TabsTrigger 
                  value="assignments" 
                  className="w-full justify-start data-[state=active]:bg-red-50 data-[state=active]:text-red-700"
                >
                  <UserCheck className="h-4 w-4 mr-3" />
                  Phân công bệnh nhân
                </TabsTrigger>
                <TabsTrigger 
                  value="diseases" 
                  className="w-full justify-start data-[state=active]:bg-red-50 data-[state=active]:text-red-700"
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Quản lý bệnh
                </TabsTrigger>
                <TabsTrigger 
                  value="upload" 
                  className="w-full justify-start data-[state=active]:bg-red-50 data-[state=active]:text-red-700"
                >
                  <Upload className="h-4 w-4 mr-3" />
                  Upload dữ liệu
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
                    <CardTitle className="text-sm font-medium">Tổng số bác sĩ</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+2 từ tháng trước</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Số bệnh trong hệ thống</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">157</div>
                    <p className="text-xs text-muted-foreground">+12 bệnh mới</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mẫu xét nghiệm</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">Tuần này</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Độ chính xác</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94.2%</div>
                    <p className="text-xs text-muted-foreground">Gợi ý chẩn đoán</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <UserManagement />
            </TabsContent>

            <TabsContent value="assignments" className="mt-0">
              <PatientAssignment />
            </TabsContent>

            <TabsContent value="diseases" className="mt-0">
              <DiseaseManagement />
            </TabsContent>

            <TabsContent value="upload" className="mt-0">
              <DataUpload />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};
