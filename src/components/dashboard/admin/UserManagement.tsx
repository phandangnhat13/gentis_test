
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'BS. Nguyễn Văn A',
      phone: '0901234567',
      email: 'bacsi.a@gentis.com',
      organization: 'Bệnh viện Đa khoa Trung ương',
      role: 'doctor',
      status: 'active',
      accountCode: 'GEN001'
    },
    {
      id: 2,
      name: 'BS. Trần Thị B',
      phone: '0902345678',
      email: 'bacsi.b@hospital.com',
      organization: 'Bệnh viện Chợ Rẫy',
      role: 'collaborator',
      status: 'active',
      accountCode: 'COL001'
    },
    {
      id: 3,
      name: 'BS. Lê Văn C',
      phone: '0903456789',
      email: 'bacsi.c@clinic.com',
      organization: 'Phòng khám Đa khoa ABC',
      role: 'doctor',
      status: 'inactive',
      accountCode: 'GEN002'
    }
  ]);

  const handleCreateUser = (formData: FormData) => {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const organization = formData.get('organization') as string;
    const role = formData.get('role') as string;

    if (!name || !phone || !email || !organization || !role) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive"
      });
      return;
    }

    // Generate account code
    const prefix = role === 'doctor' ? 'GEN' : 'COL';
    const count = users.filter(u => u.role === role).length + 1;
    const accountCode = `${prefix}${count.toString().padStart(3, '0')}`;

    const newUser = {
      id: users.length + 1,
      name,
      phone,
      email,
      organization,
      role,
      status: 'active',
      accountCode
    };

    setUsers([...users, newUser]);
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Tạo tài khoản thành công",
      description: `Đã tạo tài khoản cho ${name} với mã ${accountCode}`,
    });
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "Xóa tài khoản",
      description: "Đã xóa tài khoản thành công",
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.accountCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý người dùng</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Thêm bác sĩ mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tạo tài khoản bác sĩ mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateUser(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div>
                <Label htmlFor="name">Họ tên *</Label>
                <Input id="name" name="name" placeholder="Nhập họ tên bác sĩ" required />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input id="phone" name="phone" placeholder="Nhập số điện thoại" required />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" placeholder="Nhập email" required />
              </div>
              <div>
                <Label htmlFor="organization">Cơ quan công tác *</Label>
                <Input id="organization" name="organization" placeholder="Nhập tên cơ quan" required />
              </div>
              <div>
                <Label htmlFor="role">Vai trò *</Label>
                <Select name="role" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Bác sĩ Gentis</SelectItem>
                    <SelectItem value="collaborator">Bác sĩ cộng tác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Tạo tài khoản
              </Button>
            </form>
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
                  <th className="text-left p-3 font-medium text-slate-600">Mã tài khoản</th>
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-mono text-sm font-medium text-red-600">{user.accountCode}</div>
                    </td>
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteUser(user.id)}
                        >
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
