import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffManagement } from '@/components/admin/StaffManagement';
import { TaskCreation } from '@/components/admin/TaskCreation';
import { TaskBucket } from '@/components/admin/TaskBucket';
import { StaffDropZone } from '@/components/admin/StaffDropZone';
import { TaskOverview } from '@/components/admin/TaskOverview';
import { TaskReview } from '@/components/admin/TaskReview';
import { ApprovedTasks } from '@/components/admin/ApprovedTasks';
import { Cpu, LogOut, Users, ClipboardList, CheckSquare, Award } from 'lucide-react';

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const assignTaskMutation = useMutation({
    mutationFn: async ({ taskId, staffId }: { taskId: string; staffId: string }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ assigned_to: staffId })
        .eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: 'Task Assigned', description: 'Task has been assigned to staff member.' });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.data.current?.task) {
      assignTaskMutation.mutate({ taskId: active.id as string, staffId: over.id as string });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="w-8 h-8 text-primary" />
            <span className="font-display font-bold text-lg">Admin Dashboard</span>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="tasks" className="gap-2"><ClipboardList className="w-4 h-4" />Tasks</TabsTrigger>
            <TabsTrigger value="staff" className="gap-2"><Users className="w-4 h-4" />Staff</TabsTrigger>
            <TabsTrigger value="review" className="gap-2"><CheckSquare className="w-4 h-4" />Review</TabsTrigger>
            <TabsTrigger value="approved" className="gap-2"><Award className="w-4 h-4" />Approved</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <DndContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6">
                  <TaskCreation />
                  <TaskBucket />
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <StaffDropZone />
                  <TaskOverview />
                </div>
              </div>
            </DndContext>
          </TabsContent>

          <TabsContent value="staff"><StaffManagement /></TabsContent>
          <TabsContent value="review"><TaskReview /></TabsContent>
          <TabsContent value="approved"><ApprovedTasks /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
