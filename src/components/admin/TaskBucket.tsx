import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Phone, Laptop, Clock } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface Task {
  id: string;
  customer_name: string;
  contact_number: string;
  device_name: string;
  problem_reported: string;
  status: string;
  created_at: string;
  assigned_to: string | null;
}

const DraggableTask = ({ task, onDelete }: { task: Task; onDelete: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-4 rounded-lg bg-background/50 border border-border/50 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium">{task.customer_name}</h4>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="w-3 h-3 text-destructive" />
        </Button>
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Phone className="w-3 h-3" />
          {task.contact_number}
        </div>
        <div className="flex items-center gap-2">
          <Laptop className="w-3 h-3" />
          {task.device_name}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3" />
          {new Date(task.created_at).toLocaleDateString()}
        </div>
      </div>
      <p className="text-sm mt-2 line-clamp-2">{task.problem_reported}</p>
      <Badge variant="secondary" className="mt-2">
        Unassigned
      </Badge>
    </div>
  );
};

export const TaskBucket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', 'unassigned'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .is('assigned_to', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Task Deleted',
        description: 'The task has been removed.',
      });
    },
  });

  return (
    <Card className="glass border-border/50 h-full">
      <CardHeader>
        <CardTitle className="font-display text-xl flex items-center justify-between">
          Task Bucket
          {tasks && tasks.length > 0 && (
            <Badge variant="outline">{tasks.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading tasks...</div>
        ) : !tasks || tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No unassigned tasks. Create a new task to get started.
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {tasks.map((task) => (
              <DraggableTask
                key={task.id}
                task={task}
                onDelete={() => deleteTaskMutation.mutate(task.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
