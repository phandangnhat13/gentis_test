
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { 
  User, 
  Users, 
  TestTube, 
  BarChart3, 
  Database, 
  BookOpen,
  Activity,
  UserCog
} from 'lucide-react';
import { PatientManagement } from './doctor/PatientManagement';
import { TestManagement } from './doctor/TestManagement';
import { DiseaseView } from './doctor/DiseaseView';
import { TestAnalysis } from './doctor/TestAnalysis';
import { DataAnalysis } from './doctor/DataAnalysis';
import { ProfileManagement } from './doctor/ProfileManagement';

interface DoctorDashboardProps {
  user: {
    role: 'admin' | 'doctor' | 'collaborator';
    name: string;
    phone: string;
  };
  onLogout: () => void;
}

const menuItems = [
  { id: 'patients', label: 'Quản lý bệnh nhân', icon: Users },
  { id: 'tests', label: 'Quản lý xét nghiệm', icon: TestTube },
  { id: 'analysis', label: 'Phân tích số liệu', icon: BarChart3 },
  { id: 'batch', label: 'Phân tích hàng loạt', icon: Database },
  { id: 'diseases', label: 'Danh mục bệnh', icon: BookOpen },
  { id: 'profile', label: 'Hồ sơ cá nhân', icon: UserCog },
];

const DoctorSidebar = ({ activeTab, setActiveTab, userRole }: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  userRole: string;
}) => {
  const filteredMenuItems = menuItems.filter(item => {
    if (userRole === 'collaborator') {
      // Bác sĩ cộng tác không có quyền truy cập phân tích số liệu và phân tích hàng loạt
      return !['analysis', 'batch'].includes(item.id);
    }
    return true;
  });

  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold mb-4">
            <Activity className="h-5 w-5 mr-2" />
            SLSS Gentis
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export const DoctorDashboard = ({ user, onLogout }: DoctorDashboardProps) => {
  const [activeTab, setActiveTab] = useState('patients');

  const renderContent = () => {
    switch (activeTab) {
      case 'patients':
        return <PatientManagement userRole={user.role} />;
      case 'tests':
        return <TestManagement />;
      case 'analysis':
        return user.role !== 'collaborator' ? (
          <TestAnalysis userRole={user.role} />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">Bác sĩ cộng tác không có quyền truy cập chức năng này</p>
          </div>
        );
      case 'batch':
        return user.role !== 'collaborator' ? (
          <DataAnalysis />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">Bác sĩ cộng tác không có quyền truy cập chức năng này</p>
          </div>
        );
      case 'diseases':
        return <DiseaseView />;
      case 'profile':
        return <ProfileManagement user={user} />;
      default:
        return <PatientManagement userRole={user.role} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-50 flex w-full">
        <DoctorSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          userRole={user.role}
        />
        
        <SidebarInset className="flex-1">
          <header className="bg-white border-b border-slate-200 py-4 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SidebarTrigger className="mr-4" />
                <h1 className="text-2xl font-bold text-slate-800">
                  Chào mừng, {user.name} ({user.role === 'collaborator' ? 'Bác sĩ cộng tác' : user.role === 'doctor' ? 'Bác sĩ Gentis' : user.role})
                </h1>
              </div>
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
                  <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                    Hồ sơ cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
