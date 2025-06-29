
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileManagementProps {
  user: {
    role: 'admin' | 'doctor' | 'collaborator';
    name: string;
    phone: string;
  };
}

export const ProfileManagement = ({ user }: ProfileManagementProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    email: 'doctor@slss.com',
    specialization: 'Nội khoa',
    experience: '5 năm',
    workplace: 'Bệnh viện Đại học Y Hà Nội'
  });
  const { toast } = useToast();

  const handleSave = () => {
    // Simulate saving to backend
    console.log('Saving profile data:', formData);
    
    toast({
      title: "Cập nhật thành công",
      description: "Thông tin cá nhân đã được cập nhật",
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      phone: user.phone,
      email: 'doctor@slss.com',
      specialization: 'Nội khoa',
      experience: '5 năm',
      workplace: 'Bệnh viện Đại học Y Hà Nội'
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Hồ sơ cá nhân</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://github.com/shadcn.png" alt={user.name} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{formData.name}</h3>
              <p className="text-slate-600 capitalize">{user.role === 'collaborator' ? 'Bác sĩ cộng tác' : 'Bác sĩ'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Chuyên khoa</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Kinh nghiệm</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workplace">Nơi làm việc</Label>
              <Input
                id="workplace"
                value={formData.workplace}
                onChange={(e) => setFormData({...formData, workplace: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex space-x-4 pt-4">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thống kê hoạt động</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">Số bệnh nhân đã khám</h4>
              <p className="text-2xl font-bold text-blue-600">156</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800">Xét nghiệm đã phân tích</h4>
              <p className="text-2xl font-bold text-green-600">324</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800">Báo cáo đã tạo</h4>
              <p className="text-2xl font-bold text-purple-600">89</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
