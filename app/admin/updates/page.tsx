"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, FileEdit as Edit, Trash2, Newspaper, Briefcase, Megaphone, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface Update {
  _id: string;
  title: string;
  content: string;
  type: 'news' | 'job' | 'announcement';
  isFeatured: boolean;
  publishDate: string;
  isActive: boolean;
}

const typeConfig = {
  news: { icon: Newspaper, color: 'bg-blue-100 text-blue-800', label: 'News' },
  job: { icon: Briefcase, color: 'bg-green-100 text-green-800', label: 'Job' },
  announcement: { icon: Megaphone, color: 'bg-purple-100 text-purple-800', label: 'Announcement' },
};

export default function AdminUpdates() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'news' as 'news' | 'job' | 'announcement',
    isFeatured: false,
    publishDate: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await fetch('/api/v1/updates');
      const data = await response.json();
      setUpdates(data.updates || []);
    } catch (error) {
      toast.error('Failed to fetch updates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Please login again');
        return;
      }

      const updateData = {
        ...formData,
        publishDate: new Date(formData.publishDate).toISOString(),
      };

      const url = editingUpdate 
        ? `/api/v1/updates/${editingUpdate._id}`
        : '/api/v1/updates';
      
      const method = editingUpdate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success(editingUpdate ? 'Update modified successfully' : 'Update created successfully');
        setDialogOpen(false);
        resetForm();
        fetchUpdates();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (update: Update) => {
    setEditingUpdate(update);
    setFormData({
      title: update.title,
      content: update.content,
      type: update.type,
      isFeatured: update.isFeatured,
      publishDate: new Date(update.publishDate).toISOString().split('T')[0],
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/v1/updates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Update deleted successfully');
        fetchUpdates();
      } else {
        toast.error('Failed to delete update');
      }
    } catch (error) {
      toast.error('Failed to delete update');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'news',
      isFeatured: false,
      publishDate: new Date().toISOString().split('T')[0],
    });
    setEditingUpdate(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Updates Management</h1>
          <p className="text-gray-600">Manage news, job opportunities, and announcements</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Update
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingUpdate ? 'Edit Update' : 'Add New Update'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Update title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  required
                  rows={6}
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Update content..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'news' | 'job' | 'announcement') => 
                      setFormData(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="job">Job Opportunity</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input
                    id="publishDate"
                    name="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isFeatured: checked }))
                  }
                />
                <Label htmlFor="isFeatured">Featured Update</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingUpdate ? 'Update' : 'Create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {updates.map((update) => {
          const config = typeConfig[update.type];
          const IconComponent = config.icon;
          
          return (
            <Card key={update._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={config.color}>
                      <IconComponent className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                    {update.isFeatured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(update.publishDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(update)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(update._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl">{update.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {update.content}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {updates.length === 0 && (
        <div className="text-center py-12">
          <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No updates found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first update.</p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Update
          </Button>
        </div>
      )}
    </div>
  );
}