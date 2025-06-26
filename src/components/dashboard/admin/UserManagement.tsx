
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users] = useState([
    {
      id: 1,
      name: 'BS. Nguyễn Văn A',
      phone: '0901234567',
      email: 'bacsi.a@gentis.com',
      organization: 'Bệnh viện Đa khoa Trung ương',
      role: 'doctor',
      status: 'active'
    },
    {
      id: 2,
      name: 'BS. Trần Thị B',
      phone: '0902345678',
      email: 'bacsi.b@hospital.com',
      organization: 'Bệnh viện Chợ Rẫy',
      role: 'collaborator',
      status: 'active'
    },
    {
      id: 3,
      name: 'BS. Lê Văn C',
      phone: '0903456789',
      email: 'bacsi.c@clinic.com',
      organization: 'Phòng khám Đa khoa ABC',
      role: 'doctor',
      status: 'inactive'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý người dùng</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Thêm bác sĩ mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm bác sĩ mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Họ tên</Label>
                <Input id="name" placeholder="Nhập họ tên bác sĩ" />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" placeholder="Nhập số điện thoại" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Nhập email" />
              </div>
              <div>
                <Label htmlFor="organization">Cơ quan công tác</Label>
                <Input id="organization" placeholder="Nhập tên cơ quan" />
              </div>
              <div>
                <Label htmlFor="role">Vai trò</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Bác sĩ Gentis</SelectItem>
                    <SelectItem value="collaborator">Bác sĩ cộng tác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700">Tạo tài khoản</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm bác sĩ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 font-medium text-slate-600">Họ tên</th>
                  <th className="text-left p-3 font-medium text-slate-600">Số điện thoại</th>
                  <th className="text-left p-3 font-medium text-slate-600">Email</th>
                  <th className="text-left p-3 font-medium text-slate-600">Cơ quan</th>
                  <th className="text-left p-3 font-medium text-slate-600">Vai trò</th>
                  <th className="text-left p-3 font-medium text-slate-600">Trạng thái</th>
                  <th className="text-left p-3 font-medium text-slate-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-medium text-slate-800">{user.name}</div>
                    </td>
                    <td className="p-3 text-slate-600">{user.phone}</td>
                    <td className="p-3 text-slate-600">{user.email}</td>
                    <td className="p-3 text-slate-600">{user.organization}</td>
                    <td className="p-3">
                      <Badge variant={user.role === 'doctor' ? 'default' : 'secondary'}>
                        {user.role === 'doctor' ? 'Bác sĩ Gentis' : 'Bác sĩ cộng tác'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
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
