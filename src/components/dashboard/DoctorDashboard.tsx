
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
  Settings,
  Eye
} from 'lucide-react';
import { PatientManagement } from './doctor/PatientManagement';
import { TestManagement } from './doctor/TestManagement';
import { GentisTestManagement } from './doctor/GentisTestManagement';
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
  { id: 'results', label: 'Xem kết quả', icon: Eye },
  { id: 'analysis', label: 'Phân tích số liệu', icon: BarChart3 },
  { id: 'batch', label: 'Phân tích hàng loạt', icon: Database },
  { id: 'diseases', label: 'Danh mục bệnh', icon: BookOpen },
  { id: 'profile', label: 'Hồ sơ cá nhân', icon: Settings },
];

const DoctorSidebar = ({ activeTab, setActiveTab, userRole }: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  userRole: string;
}) => {
  let filteredMenuItems;
  
  if (userRole === 'collaborator') {
    // Collaborator menu: patients, results (view only), diseases, profile
    filteredMenuItems = menuItems.filter(item => 
      ['patients', 'results', 'diseases', 'profile'].includes(item.id)
    );
  } else {
    // Doctor menu: all except results (they use tests instead)
    filteredMenuItems = menuItems.filter(item => item.id !== 'results');
  }

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
        // Use enhanced test management for Gentis role
        return user.role === 'doctor' ? (
          <GentisTestManagement />
        ) : (
          <TestManagement userRole={user.role} />
        );
      case 'results':
        // Special view for collaborators - read-only test results
        return user.role === 'collaborator' ? (
          <CollaboratorResultsView />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">Trang này không có sẵn cho vai trò này</p>
          </div>
        );
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

  const getUserRoleDisplay = () => {
    switch (user.role) {
      case 'doctor':
        return 'Bác sĩ Gentis';
      case 'collaborator':
        return 'Bác sĩ cộng tác';
      case 'admin':
        return 'Quản trị viên';
      default:
        return user.role;
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
                  Chào mừng, {user.name} ({getUserRoleDisplay()})
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

          <main className="p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

// Component for collaborator results view
const CollaboratorResultsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Xem kết quả xét nghiệm</h2>
        <div className="text-sm text-slate-600">
          Chế độ xem chỉ đọc - Bác sĩ cộng tác
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kết quả xét nghiệm của bệnh nhân được phân công</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Lưu ý quan trọng:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Bạn chỉ có thể xem kết quả của các bệnh nhân được phân công cho tài khoản của mình</li>
                <li>• Tất cả dữ liệu hiển thị ở chế độ chỉ đọc</li>
                <li>• Bạn có thể xuất báo cáo nhưng không thể chỉnh sửa kết quả</li>
                <li>• Để xem chi tiết từng bệnh nhân, vui lòng sử dụng trang "Quản lý bệnh nhân"</li>
              </ul>
            </div>
            
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                Xem kết quả chi tiết
              </h3>
              <p className="text-slate-600 mb-4">
                Vui lòng chuyển sang trang "Quản lý bệnh nhân" để xem kết quả chi tiết của từng bệnh nhân
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">
                  Trong trang quản lý bệnh nhân, bạn sẽ thấy:
                </p>
                <ul className="text-sm text-slate-600 mt-2 space-y-1">
                  <li>• Bảng kết quả xét nghiệm chi tiết</li>
                  <li>• Nhận định của bác sĩ Gentis</li>
                  <li>• Chỉ số sinh học và đánh giá</li>
                  <li>• Khuyến nghị điều trị</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
