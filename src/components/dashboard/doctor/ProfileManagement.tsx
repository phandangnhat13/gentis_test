
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Save, Edit, Camera, User } from 'lucide-react';
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
    email: `${user.name.toLowerCase().replace(/\s+/g, '.')}@gentis.com`,
    specialization: user.role === 'doctor' ? 'Bác sĩ Gentis' : user.role === 'collaborator' ? 'Bác sĩ cộng tác' : 'Quản trị viên',
    organization: user.role === 'doctor' ? 'Gentis Medical Center' : 'Bệnh viện Đa khoa',
    experience: '5 năm',
    description: 'Bác sĩ chuyên khoa với nhiều năm kinh nghiệm trong lĩnh vực chẩn đoán và điều trị.',
    address: 'TP. Hồ Chí Minh',
    emergencyContact: '0909123456'
  });

  const { toast } = useToast();

  const handleSave = () => {
    console.log('Lưu thông tin hồ sơ:', profileData);
    toast({
      title: "Cập nhật thành công",
      description: "Thông tin hồ sơ của bạn đã được cập nhật",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      name: user.name,
      phone: user.phone,
      email: `${user.name.toLowerCase().replace(/\s+/g, '.')}@gentis.com`,
      specialization: user.role === 'doctor' ? 'Bác sĩ Gentis' : user.role === 'collaborator' ? 'Bác sĩ cộng tác' : 'Quản trị viên',
      organization: user.role === 'doctor' ? 'Gentis Medical Center' : 'Bệnh viện Đa khoa',
      experience: '5 năm',
      description: 'Bác sĩ chuyên khoa với nhiều năm kinh nghiệm trong lĩnh vực chẩn đoán và điều trị.',
      address: 'TP. Hồ Chí Minh',
      emergencyContact: '0909123456'
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Hồ sơ cá nhân</h2>
        <div className="flex space-x-2">
          {!isEditing ? (
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src="https://github.com/shadcn.png" alt={profileData.name} />
                <AvatarFallback className="text-lg">
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  onClick={() => {
                    toast({
                      title: "Tính năng sắp ra mắt",
                      description: "Chức năng thay đổi ảnh đại diện sẽ sớm được cập nhật",
                    });
                  }}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            <CardTitle className="mt-4">{profileData.name}</CardTitle>
            <Badge variant={user.role === 'doctor' ? 'default' : 'secondary'} className="mt-2">
              {profileData.specialization}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-slate-600">Tổ chức</p>
              <p className="font-medium">{profileData.organization}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Kinh nghiệm</p>
              <p className="font-medium">{profileData.experience}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Vai trò hệ thống</p>
              <Badge variant="outline">{user.role}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="specialization">Chuyên khoa</Label>
                <Input
                  id="specialization"
                  value={profileData.specialization}
                  onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organization">Cơ quan công tác</Label>
                <Input
                  id="organization"
                  value={profileData.organization}
                  onChange={(e) => setProfileData({...profileData, organization: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="experience">Kinh nghiệm</Label>
                <Input
                  id="experience"
                  value={profileData.experience}
                  onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Liên hệ khẩn cấp</Label>
                <Input
                  id="emergencyContact"
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Mô tả bản thân</Label>
              <Textarea
                id="description"
                value={profileData.description}
                onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                disabled={!isEditing}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê hoạt động</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">45</p>
              <p className="text-sm text-slate-600">Bệnh nhân đã điều trị</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">128</p>
              <p className="text-sm text-slate-600">Xét nghiệm đã phân tích</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">92%</p>
              <p className="text-sm text-slate-600">Độ chính xác chẩn đoán</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">3</p>
              <p className="text-sm text-slate-600">Tháng hoạt động</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
