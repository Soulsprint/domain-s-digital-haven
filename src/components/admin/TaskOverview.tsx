import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Phone, Laptop, MessageSquare } from 'lucide-react';

interface Task {
  id: string;
  customer_name: string;
  contact_number: string;
  device_name: string;
  problem_reported: string;
  status: string;
  staff_notes: string | null;
  assigned_to: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
}

const statusColors: Record<string, string> = {
  not_started: 'bg-muted text-muted-foreground',
  working: 'bg-yellow-500/20 text-yellow-500',
  completed: 'bg-blue-500/20 text-blue-500',
  submitted: 'bg-purple-500/20 text-purple-500',
  approved: 'bg-green-500/20 text-green-500',
  rejected: 'bg-destructive/20 text-destructive',
};

export const TaskOverview = () => {
  const { data: tasks, isLoading: loadingTasks } = useQuery({
    queryKey: ['tasks', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .not('assigned_to', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return data as Profile[];
    },
  });

  const getStaffName = (staffId: string | null) => {
    if (!staffId || !profiles) return 'Unassigned';
    const profile = profiles.find((p) => p.id === staffId);
    return profile?.full_name || profile?.email || 'Unknown';
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="font-display text-xl">Task Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {loadingTasks ? (
          <div className="text-center py-8 text-muted-foreground">Loading tasks...</div>
        ) : !tasks || tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No assigned tasks yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{task.customer_name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {task.contact_number}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-muted-foreground" />
                        {task.device_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {getStaffName(task.assigned_to)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[task.status] || ''}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.staff_notes ? (
                        <div className="flex items-start gap-1 max-w-[200px]">
                          <MessageSquare className="w-3 h-3 text-muted-foreground mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground line-clamp-2">
                            {task.staff_notes}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
