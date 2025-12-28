import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDroppable } from '@dnd-kit/core';
import { User } from 'lucide-react';

interface StaffMember {
  id: string;
  email: string;
  full_name: string | null;
  status: 'active' | 'disabled';
}

interface Task {
  id: string;
  customer_name: string;
  device_name: string;
  status: string;
}

const StaffCard = ({ staff, tasks }: { staff: StaffMember; tasks: Task[] }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: staff.id,
    data: { staff },
  });

  const assignedTasks = tasks.filter((t) => true); // Already filtered by query

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-lg border transition-all ${
        isOver
          ? 'border-primary bg-primary/10'
          : 'border-border/50 bg-background/50 hover:border-border'
      } ${staff.status === 'disabled' ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{staff.full_name || 'Unnamed'}</p>
          <p className="text-xs text-muted-foreground">{staff.email}</p>
        </div>
        <Badge variant={staff.status === 'active' ? 'default' : 'secondary'}>
          {staff.status}
        </Badge>
      </div>

      {isOver && (
        <div className="text-center py-4 border-2 border-dashed border-primary rounded-lg text-primary text-sm">
          Drop task here to assign
        </div>
      )}

      {assignedTasks.length > 0 ? (
        <div className="space-y-2">
          {assignedTasks.map((task) => (
            <div
              key={task.id}
              className="p-2 rounded bg-card/50 border border-border/30 text-sm"
            >
              <p className="font-medium">{task.customer_name}</p>
              <p className="text-muted-foreground text-xs">{task.device_name}</p>
              <Badge variant="outline" className="mt-1 text-xs">
                {task.status.replace('_', ' ')}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        !isOver && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No tasks assigned
          </p>
        )
      )}
    </div>
  );
};

export const StaffDropZone = () => {
  const { data: staffMembers, isLoading: loadingStaff } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'staff');

      if (rolesError) throw rolesError;
      if (!roles || roles.length === 0) return [];

      const userIds = roles.map((r) => r.user_id);

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      return profiles as StaffMember[];
    },
  });

  const { data: allTasks } = useQuery({
    queryKey: ['tasks', 'assigned'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .not('assigned_to', 'is', null);

      if (error) throw error;
      return data as (Task & { assigned_to: string })[];
    },
  });

  const getTasksForStaff = (staffId: string) => {
    return allTasks?.filter((t) => t.assigned_to === staffId) || [];
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="font-display text-xl">Assign Tasks to Staff</CardTitle>
        <p className="text-sm text-muted-foreground">
          Drag tasks from the bucket and drop on a staff member to assign
        </p>
      </CardHeader>
      <CardContent>
        {loadingStaff ? (
          <div className="text-center py-8 text-muted-foreground">Loading staff...</div>
        ) : !staffMembers || staffMembers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No staff members. Add staff members first.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffMembers.map((staff) => (
              <StaffCard
                key={staff.id}
                staff={staff}
                tasks={getTasksForStaff(staff.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
