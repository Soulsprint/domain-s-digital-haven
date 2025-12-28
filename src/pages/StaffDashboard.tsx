import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cpu, LogOut, Phone, Laptop, AlertCircle, Send } from 'lucide-react';

const statusColors: Record<string, string> = {
  not_started: 'bg-muted text-muted-foreground',
  working: 'bg-yellow-500/20 text-yellow-500',
  completed: 'bg-blue-500/20 text-blue-500',
  submitted: 'bg-purple-500/20 text-purple-500',
  rejected: 'bg-destructive/20 text-destructive',
};

const StaffDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Record<string, string>>({});

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', user?.id)
        .not('status', 'eq', 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status, staffNotes }: { taskId: string; status: string; staffNotes?: string }) => {
      const updateData: any = { status };
      if (staffNotes !== undefined) updateData.staff_notes = staffNotes;
      const { error } = await supabase.from('tasks').update(updateData).eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      toast({ title: 'Task Updated' });
    },
  });

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
            <span className="font-display font-bold text-lg">Staff Dashboard</span>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="font-display text-2xl mb-6">My Assigned Tasks</h2>
        
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : !tasks || tasks.length === 0 ? (
          <Card className="glass"><CardContent className="py-8 text-center text-muted-foreground">No tasks assigned to you.</CardContent></Card>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{task.customer_name}</CardTitle>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{task.contact_number}</span>
                        <span className="flex items-center gap-1"><Laptop className="w-3 h-3" />{task.device_name}</span>
                      </div>
                    </div>
                    <Badge className={statusColors[task.status]}>{task.status.replace('_', ' ')}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p><strong>Problem:</strong> {task.problem_reported}</p>
                  
                  {task.status === 'rejected' && task.rejection_reason && (
                    <div className="p-3 rounded bg-destructive/10 border border-destructive/30 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                      <div><p className="text-sm font-medium text-destructive">Rejection Reason:</p><p className="text-sm">{task.rejection_reason}</p></div>
                    </div>
                  )}

                  {task.status !== 'submitted' && (
                    <div className="flex flex-wrap gap-4 items-end">
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-sm text-muted-foreground mb-1 block">Status</label>
                        <Select value={task.status} onValueChange={(v) => updateTaskMutation.mutate({ taskId: task.id, status: v })}>
                          <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not_started">Not Started</SelectItem>
                            <SelectItem value="working">Working</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-[2] min-w-[200px]">
                        <label className="text-sm text-muted-foreground mb-1 block">Notes</label>
                        <Textarea
                          placeholder="Add notes..."
                          value={notes[task.id] ?? task.staff_notes ?? ''}
                          onChange={(e) => setNotes({ ...notes, [task.id]: e.target.value })}
                          className="bg-background/50"
                        />
                      </div>
                      {task.status === 'completed' && (
                        <Button
                          variant="glow"
                          className="gap-2"
                          onClick={() => updateTaskMutation.mutate({ taskId: task.id, status: 'submitted', staffNotes: notes[task.id] ?? task.staff_notes })}
                        >
                          <Send className="w-4 h-4" /> Submit for Review
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffDashboard;
