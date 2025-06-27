import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreVertical, User } from 'lucide-react';
import { ReportsView } from './doctor/ReportsView';
import { PatientManagement } from './doctor/PatientManagement';
import { TestManagement } from './doctor/TestManagement';
import { DiseaseView } from './doctor/DiseaseView';
import { TestAnalysis } from './doctor/TestAnalysis';
import { DataAnalysis } from './doctor/DataAnalysis';

interface DoctorDashboardProps {
  user: {
    role: 'admin' | 'doctor' | 'collaborator';
    name: string;
    phone: string;
  };
  onLogout: () => void;
}

export const DoctorDashboard = ({ user, onLogout }: DoctorDashboardProps) => {
  const [activeTab, setActiveTab] = useState('reports');

  const stats = {
    patients: 120,
    tests: 350,
    highRisk: 45,
    mediumRisk: 60,
    lowRisk: 15
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            Chào mừng, {user.name} ({user.role})
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open user menu</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt={user.name} />
                  <AvatarFallback><User className="h-4 w-4"/></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
              <DropdownMenuItem>
                Hồ sơ
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="reports">Báo cáo chẩn đoán</TabsTrigger>
            <TabsTrigger value="patients">Quản lý bệnh nhân</TabsTrigger>
            <TabsTrigger value="tests">Quản lý xét nghiệm</TabsTrigger>
            <TabsTrigger value="analysis">Phân tích số liệu</TabsTrigger>
            <TabsTrigger value="batch">Phân tích hàng loạt</TabsTrigger>
            <TabsTrigger value="diseases">Danh mục bệnh</TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <ReportsView userRole={user.role} />
          </TabsContent>

          <TabsContent value="patients">
            <PatientManagement userRole={user.role} />
          </TabsContent>

          <TabsContent value="tests">
            {user.role !== 'collaborator' ? (
              <TestManagement />
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">Bác sĩ cộng tác không có quyền truy cập chức năng này</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis">
            <TestAnalysis userRole={user.role} />
          </TabsContent>

          <TabsContent value="batch">
            {user.role !== 'collaborator' ? (
              <DataAnalysis />
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">Bác sĩ cộng tác không có quyền truy cập chức năng này</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="diseases">
            <DiseaseView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
