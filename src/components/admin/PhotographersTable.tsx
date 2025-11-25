import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserMinus, Pencil, Mail } from 'lucide-react';
import { type Photographer } from '@/lib/services/PhotographerService';

interface PhotographersTableProps {
  photographers: Photographer[];
  loading: boolean;
  onEdit: (userId: string) => void;
  onRemove: (userId: string) => void;
  onResendPasswordReset: (userId: string) => void;
}

const getAcceptanceRateBadge = (rate: number) => {
  if (rate >= 80) return 'bg-green-500/10 text-green-500 border-green-500/20';
  if (rate >= 60) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  return 'bg-red-500/10 text-red-500 border-red-500/20';
};

export const PhotographersTable = ({ photographers, loading, onEdit, onRemove, onResendPasswordReset }: PhotographersTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fotografen</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Lädt...</div>
        ) : photographers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Noch keine Fotografen registriert
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead className="text-center">Aufträge</TableHead>
                  <TableHead className="text-center">Angenommen</TableHead>
                  <TableHead className="text-center">Abgelehnt</TableHead>
                  <TableHead className="text-center">Abgeschlossen</TableHead>
                  <TableHead className="text-center">Annahmequote</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {photographers.map((photographer) => (
                  <TableRow key={photographer.user_id}>
                    <TableCell className="font-medium">
                      {photographer.vorname} {photographer.nachname}
                    </TableCell>
                    <TableCell>{photographer.email}</TableCell>
                    <TableCell>{photographer.telefon || '-'}</TableCell>
                    <TableCell className="text-center">
                      {photographer.total_assignments}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        {photographer.accepted}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        {photographer.declined}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        {photographer.completed}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={getAcceptanceRateBadge(photographer.acceptance_rate)}
                      >
                        {photographer.acceptance_rate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onResendPasswordReset(photographer.user_id)}
                          className="gap-2"
                          title="Passwort-Reset erneut senden"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(photographer.user_id)}
                          className="gap-2"
                        >
                          <Pencil className="h-4 w-4" />
                          Bearbeiten
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemove(photographer.user_id)}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <UserMinus className="h-4 w-4" />
                          Entfernen
                        </Button>
                      </div>
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
