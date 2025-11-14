import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AssignmentCard } from '@/components/freelancer/AssignmentCard';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Assignment {
  id: string;
  order_id: string;
  status: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  admin_notes: string | null;
  photographer_notes: string | null;
  responded_at: string | null;
  orders: {
    order_number: string;
    special_instructions: string | null;
    user_id: string;
  };
}

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    completed: 0,
  });

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  const fetchAssignments = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('order_assignments')
        .select(`
          *,
          orders!inner(
            order_number,
            special_instructions,
            user_id
          )
        `)
        .eq('photographer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAssignments(data || []);
      
      // Calculate stats
      setStats({
        pending: data?.filter(a => a.status === 'pending').length || 0,
        accepted: data?.filter(a => a.status === 'accepted').length || 0,
        completed: data?.filter(a => a.status === 'completed').length || 0,
      });
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Fehler beim Laden der Aufträge');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAssignment = async (assignmentId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('order_assignments')
        .update({ 
          status: 'accepted',
          responded_at: new Date().toISOString()
        })
        .eq('id', assignmentId);

      if (error) throw error;

      toast.success('Auftrag angenommen');
      fetchAssignments();
      
      // Create notification for admin
      const assignment = assignments.find(a => a.id === assignmentId);
      if (assignment) {
        await (supabase as any).from('notifications').insert({
          user_id: assignment.orders.user_id,
          type: 'assignment_accepted',
          title: 'Fotograf hat zugestimmt',
          message: `Ihr Auftrag #${assignment.orders.order_number} wurde von einem Fotografen angenommen.`,
          link: `/admin-backend`
        });
      }
    } catch (error) {
      console.error('Error accepting assignment:', error);
      toast.error('Fehler beim Annehmen des Auftrags');
    }
  };

  const handleDeclineAssignment = async (assignmentId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('order_assignments')
        .update({ 
          status: 'declined',
          responded_at: new Date().toISOString()
        })
        .eq('id', assignmentId);

      if (error) throw error;

      toast.success('Auftrag abgelehnt');
      fetchAssignments();

      // Create notification for admin
      const assignment = assignments.find(a => a.id === assignmentId);
      if (assignment) {
        await (supabase as any).from('notifications').insert({
          user_id: assignment.orders.user_id,
          type: 'assignment_declined',
          title: 'Fotograf hat abgelehnt',
          message: `Auftrag #${assignment.orders.order_number} wurde abgelehnt. Bitte weisen Sie einen anderen Fotografen zu.`,
          link: `/admin-backend`
        });
      }
    } catch (error) {
      console.error('Error declining assignment:', error);
      toast.error('Fehler beim Ablehnen des Auftrags');
    }
  };

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const acceptedAssignments = assignments.filter(a => a.status === 'accepted');
  const completedAssignments = assignments.filter(a => a.status === 'completed');

  return (
    <Layout>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <title>Freelancer Dashboard - spaceseller</title>
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Freelancer Dashboard</h1>
          <p className="text-muted-foreground">Verwalten Sie Ihre Shooting-Aufträge</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ausstehend</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Warten auf Ihre Antwort</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Angenommen</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accepted}</div>
              <p className="text-xs text-muted-foreground">Aktive Aufträge</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abgeschlossen</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Diesen Monat</p>
            </CardContent>
          </Card>
        </div>

        {/* Assignments Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Ausstehend ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Angenommen ({stats.accepted})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Abgeschlossen ({stats.completed})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Keine ausstehenden Aufträge
                </CardContent>
              </Card>
            ) : (
              pendingAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment as any}
                  onViewDetails={() => {}}
                  onAccept={() => handleAcceptAssignment(assignment.id)}
                  onDecline={() => handleDeclineAssignment(assignment.id)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {acceptedAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Keine angenommenen Aufträge
                </CardContent>
              </Card>
            ) : (
              acceptedAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment as any}
                  onViewDetails={() => {}}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Keine abgeschlossenen Aufträge
                </CardContent>
              </Card>
            ) : (
              completedAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment as any}
                  onViewDetails={() => {}}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
