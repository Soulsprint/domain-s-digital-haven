import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';

export const TaskCreation = () => {
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [problemReported, setProblemReported] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const createTaskMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('tasks').insert({
        customer_name: customerName,
        contact_number: contactNumber,
        device_name: deviceName,
        problem_reported: problemReported,
        created_by: user?.id,
        status: 'not_started',
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setCustomerName('');
      setContactNumber('');
      setDeviceName('');
      setProblemReported('');
      toast({
        title: 'Task Created',
        description: 'New repair task has been added to the bucket.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate();
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="font-display text-xl">Create New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                placeholder="Enter customer name"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-number">Contact Number</Label>
              <Input
                id="contact-number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                placeholder="Enter contact number"
                className="bg-background/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="device-name">Device Name</Label>
            <Input
              id="device-name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              required
              placeholder="e.g., iPhone 15, Dell Laptop"
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="problem-reported">Problem Reported</Label>
            <Textarea
              id="problem-reported"
              value={problemReported}
              onChange={(e) => setProblemReported(e.target.value)}
              required
              placeholder="Describe the issue..."
              className="bg-background/50 min-h-[100px]"
            />
          </div>
          <Button
            type="submit"
            variant="glow"
            className="w-full gap-2"
            disabled={createTaskMutation.isPending}
          >
            <Plus className="w-4 h-4" />
            {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
