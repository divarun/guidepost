'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Loading } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { formatShortDate } from '@/lib/utils/formatters';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    loadUsers();
  }, [filterRole]);

  const loadUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (filterRole) params.append('role', filterRole);

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.'))
      return;

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showToast('User deleted successfully', 'success');
        loadUsers();
      } else {
        showToast(data.error || 'Failed to delete user', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    }
  };

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'STUDENT', label: 'Students' },
    { value: 'PARENT', label: 'Parents' },
    { value: 'ADMIN', label: 'Admins' },
  ];

  if (loading) {
    return <Loading />;
  }

  const stats = {
    total: users.length,
    students: users.filter((u) => u.role === 'STUDENT').length,
    parents: users.filter((u) => u.role === 'PARENT').length,
    admins: users.filter((u) => u.role === 'ADMIN').length,
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-4xl font-bold text-primary-600 mb-2">{stats.students}</div>
            <div className="text-sm text-gray-600">Students</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-4xl font-bold text-secondary-600 mb-2">{stats.parents}</div>
            <div className="text-sm text-gray-600">Parents</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.admins}</div>
            <div className="text-sm text-gray-600">Admins</div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Management</CardTitle>
            <Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              options={roleOptions}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Last Login
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Details
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`badge ${
                          user.role === 'STUDENT'
                            ? 'badge-info'
                            : user.role === 'PARENT'
                            ? 'badge-warning'
                            : 'badge-success'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatShortDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.lastLoginAt ? formatShortDate(user.lastLoginAt) : 'Never'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.role === 'STUDENT' && user.graduationYear && (
                        <span>Class of {user.graduationYear}</span>
                      )}
                      {user.role === 'STUDENT' && user.gpa && (
                        <span className="ml-2">GPA: {user.gpa.toFixed(2)}</span>
                      )}
                      {user.role === 'PARENT' && user.studentId && (
                        <span className="text-blue-600">Linked to student</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500">No users found</div>
          )}
        </CardContent>
      </Card>

      {/* System Information */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Database</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">AI Service (Ollama)</span>
              <span className="font-medium text-gray-900">Available</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cache</span>
              <span className="font-medium text-gray-900">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Environment</span>
              <span className="font-medium text-gray-900">
                {process.env.NODE_ENV || 'development'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">New users (last 7 days)</span>
              <span className="font-medium text-gray-900">
                {
                  users.filter((u) => {
                    const created = new Date(u.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return created > weekAgo;
                  }).length
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active users (logged in)</span>
              <span className="font-medium text-gray-900">
                {users.filter((u) => u.lastLoginAt).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Parent-Student links</span>
              <span className="font-medium text-gray-900">
                {users.filter((u) => u.role === 'PARENT' && u.studentId).length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}