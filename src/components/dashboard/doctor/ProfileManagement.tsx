
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
  const [profileData, setProfileData] = useState({
    name: user.name,
    phone: user.phone,
    email: 'doctor@gentis.com',
    specialization: 'Bác sĩ đa khoa',
    workplace: 'Bệnh viện Đa khoa Trung ương',
    experience: '10 năm'
  });
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Cập nhật thành công",
      description: "Thông tin cá nhân đã được cập nhật",
    });
    setIsEditing(false);
    
    console.log('Updated profile:', profileData);
  };

  const handleCancel = () => {
    setProfileData({
      name: user.name,
      phone: user.phone,
      email: 'doctor@gentis.com',
      specialization: 'Bác sĩ đa khoa',
      workplace: 'Bệnh viện Đa khoa Trung ương',
      experience: '10 năm'
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Hồ sơ cá nhân</h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        ) : (
          <div className="space-x-2">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Lưu
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://github.com/shadcn.png" alt={profileData.name} />
              <AvatarFallback><User className="h-8 w-8"/></AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{profileData.name}</h3>
              <p className="text-slate-600">{user.role === 'doctor' ? 'Bác sĩ' : user.role === 'collaborator' ? 'Bác sĩ cộng tác' : 'Quản trị viên'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Chuyên khoa</Label>
              <Input
                id="specialization"
                value={profileData.specialization}
                onChange={(e) => setProfileData(prev => ({ ...prev, specialization: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workplace">Nơi làm việc</Label>
              <Input
                id="workplace"
                value={profileData.workplace}
                onChange={(e) => setProfileData(prev => ({ ...prev, workplace: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Kinh nghiệm</Label>
              <Input
                id="experience"
                value={profileData.experience}
                onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
