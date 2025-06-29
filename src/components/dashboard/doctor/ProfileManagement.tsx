
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase,
  Save,
  Edit,
  Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileManagementProps {
  user: {
    role: string;
    name: string;
    phone: string;
  };
}

export const ProfileManagement = ({ user }: ProfileManagementProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: 'doctor@example.com',
    phone: user.phone,
    address: 'Hà Nội, Việt Nam',
    specialization: 'Nội khoa tổng quát',
    experience: '5 năm',
    education: 'Bác sĩ Đa khoa - Đại học Y Hà Nội',
    bio: 'Bác sĩ có kinh nghiệm trong lĩnh vực nội khoa và chẩn đoán hình ảnh.',
    licenseNumber: 'BS123456',
    workPlace: 'Bệnh viện Đa khoa Central'
  });
  
  const { toast } = useToast();

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      });
      setIsEditing(false);
    }, 1000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Tải ảnh thành công",
        description: "Ảnh đại diện đã được cập nhật",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Hồ sơ cá nhân</h2>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          <Edit className="h-4 w-4 mr-2" />
          {isEditing ? 'Hủy' : 'Chỉnh sửa'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="https://github.com/shadcn.png" alt={profileData.name} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label htmlFor="avatar-upload">
                      <Button size="sm" className="h-8 w-8 p-0 rounded-full" asChild>
                        <span>
                          <Camera className="h-4 w-4" />
                        </span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold">{profileData.name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {user.role === 'collaborator' ? 'Bác sĩ cộng tác' : 'Bác sĩ'}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-slate-500" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-slate-500" />
                <span>{profileData.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span>{profileData.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Briefcase className="h-4 w-4 text-slate-500" />
                <span>{profileData.specialization}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span>{profileData.experience} kinh nghiệm</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Chi tiết thông tin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

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
                <Label htmlFor="specialization">Chuyên khoa</Label>
                <Input
                  id="specialization"
                  value={profileData.specialization}
                  onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
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

              <div>
                <Label htmlFor="license">Số chứng chỉ hành nghề</Label>
                <Input
                  id="license"
                  value={profileData.licenseNumber}
                  onChange={(e) => setProfileData({...profileData, licenseNumber: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="workplace">Nơi công tác</Label>
                <Input
                  id="workplace"
                  value={profileData.workPlace}
                  onChange={(e) => setProfileData({...profileData, workPlace: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="education">Học vấn</Label>
              <Input
                id="education"
                value={profileData.education}
                onChange={(e) => setProfileData({...profileData, education: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="bio">Giới thiệu bản thân</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                disabled={!isEditing}
                rows={4}
              />
            </div>

            {isEditing && (
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
              </div>
            )}
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
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">45</div>
              <div className="text-sm text-blue-600">Bệnh nhân phụ trách</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">128</div>
              <div className="text-sm text-green-600">Xét nghiệm đã xem</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">92%</div>
              <div className="text-sm text-yellow-600">Độ chính xác chẩn đoán</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">3.2</div>
              <div className="text-sm text-purple-600">Năm sử dụng hệ thống</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
