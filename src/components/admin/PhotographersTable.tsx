import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserMinus, Pencil, Mail, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { type Photographer } from '@/lib/services/PhotographerService';
import { format, parseISO, isBefore, addDays } from 'date-fns';
import { de } from 'date-fns/locale';

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

const getInsuranceStatus = (berufshaftpflicht_bis: string | null) => {
  if (!berufshaftpflicht_bis) {
    return { status: 'missing', message: 'Keine Versicherung hinterlegt', color: 'text-muted-foreground' };
  }
  
  const expiryDate = parseISO(berufshaftpflicht_bis);
  const today = new Date();
  const warningDate = addDays(today, 30);
  
  if (isBefore(expiryDate, today)) {
    return { status: 'expired', message: 'Abgelaufen', color: 'text-destructive' };
  }
  
  if (isBefore(expiryDate, warningDate)) {
    return { status: 'expiring', message: 'Läuft bald ab', color: 'text-yellow-600' };
  }
  
  return { status: 'valid', message: format(expiryDate, 'dd.MM.yyyy', { locale: de }), color: 'text-green-600' };
};

const maskIBAN = (iban: string | null) => {
  if (!iban) return '-';
  // Show only last 4 digits: DE** **** **** **** **1234
  const cleaned = iban.replace(/\s/g, '');
  if (cleaned.length < 4) return iban;
  return `${cleaned.substring(0, 2)}** **** **** **** **${cleaned.substring(cleaned.length - 4)}`;
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
                  <TableHead className="text-center">Steuer</TableHead>
                  <TableHead className="text-center">Versicherung</TableHead>
                  <TableHead>Bankdaten</TableHead>
                  <TableHead className="text-center">Aufträge</TableHead>
                  <TableHead className="text-center">Angenommen</TableHead>
                  <TableHead className="text-center">Abgelehnt</TableHead>
                  <TableHead className="text-center">Abgeschlossen</TableHead>
                  <TableHead className="text-center">Annahmequote</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {photographers.map((photographer) => {
                  const insuranceStatus = getInsuranceStatus(photographer.berufshaftpflicht_bis);
                  
                  return (
                    <TableRow key={photographer.user_id}>
                      <TableCell className="font-medium">
                        {photographer.vorname} {photographer.nachname}
                      </TableCell>
                      <TableCell>{photographer.email}</TableCell>
                      <TableCell>{photographer.telefon || '-'}</TableCell>
                      <TableCell className="text-center">
                        {photographer.kleinunternehmer ? (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            §19
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border gap-1">
                            <XCircle className="h-3 w-3" />
                            USt.
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {insuranceStatus.status === 'expired' && (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                          {insuranceStatus.status === 'expiring' && (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                          <span className={`text-sm ${insuranceStatus.color}`}>
                            {insuranceStatus.message}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div className="font-mono">{maskIBAN(photographer.iban)}</div>
                          {photographer.kontoinhaber && (
                            <div className="text-muted-foreground">{photographer.kontoinhaber}</div>
                          )}
                        </div>
                      </TableCell>
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
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
