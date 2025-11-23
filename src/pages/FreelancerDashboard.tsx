import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeclineReasonDialog } from '@/components/freelancer/DeclineReasonDialog';
import { AssignmentStatsCards } from '@/components/freelancer/AssignmentStatsCards';
import { AssignmentsList } from '@/components/freelancer/AssignmentsList';
import { 
  usePhotographerAssignments, 
  useAssignmentStats, 
  useAssignmentGroups,
  useAssignmentActions 
} from '@/lib/hooks/useAssignments';

export default function FreelancerDashboard() {
  const { data: assignments = [], isLoading } = usePhotographerAssignments();
  const stats = useAssignmentStats(assignments);
  const groups = useAssignmentGroups(assignments);
  const { acceptAssignment, declineAssignment } = useAssignmentActions();
  
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [assignmentToDecline, setAssignmentToDecline] = useState<string | null>(null);

  const handleAccept = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      acceptAssignment(assignmentId, assignment);
    }
  };

  const handleDecline = (reason: string) => {
    if (assignmentToDecline) {
      const assignment = assignments.find(a => a.id === assignmentToDecline);
      if (assignment) {
        declineAssignment(assignmentToDecline, reason, assignment);
        setDeclineDialogOpen(false);
        setAssignmentToDecline(null);
      }
    }
  };

  const onDeclineClick = (assignmentId: string) => {
    setAssignmentToDecline(assignmentId);
    setDeclineDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

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

        <AssignmentStatsCards stats={stats} />

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
            <AssignmentsList
              assignments={groups.pending}
              emptyMessage="Keine ausstehenden Aufträge"
              onAccept={handleAccept}
              onDecline={onDeclineClick}
            />
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            <AssignmentsList
              assignments={groups.accepted}
              emptyMessage="Keine angenommenen Aufträge"
            />
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <AssignmentsList
              assignments={groups.completed}
              emptyMessage="Keine abgeschlossenen Aufträge"
            />
          </TabsContent>
        </Tabs>
      </div>

      <DeclineReasonDialog
        open={declineDialogOpen}
        onClose={() => {
          setDeclineDialogOpen(false);
          setAssignmentToDecline(null);
        }}
        onConfirm={(reason, notes) => {
          handleDecline(notes || reason);
        }}
      />
    </Layout>
  );
}
