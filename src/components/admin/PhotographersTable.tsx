import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMinus, Pencil, Mail, AlertTriangle, CheckCircle2, CreditCard } from 'lucide-react';
import { type Photographer } from '@/lib/services/PhotographerService';
import { ProfileCompletenessService } from '@/lib/services/ProfileCompletenessService';

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

const isInsuranceExpired = (date: string | null): boolean => {
  if (!date) return false;
  return new Date(date) < new Date();
};

const isInsuranceExpiringSoon = (date: string | null): boolean => {
  if (!date) return false;
  const expiryDate = new Date(date);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return expiryDate < thirtyDaysFromNow && expiryDate >= new Date();
};

const maskIBAN = (iban: string | null): string => {
  if (!iban) return '';
  const cleaned = iban.replace(/\s/g, '');
  if (cleaned.length < 8) return iban;
  return `${cleaned.slice(0, 4)} **** **** **** ${cleaned.slice(-4)}`;
};

const isBankingComplete = (photographer: Photographer): boolean => {
  return !!(photographer.iban && photographer.kontoinhaber);
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
                  <TableHead>Profil-Status</TableHead>
                  <TableHead>Steuer-Status</TableHead>
                  <TableHead>Versicherung</TableHead>
                  <TableHead>Bankdaten</TableHead>
                  <TableHead className="text-center">Aufträge</TableHead>
                  <TableHead className="text-center">Angenommen</TableHead>
                  <TableHead className="text-center">Abgelehnt</TableHead>
                  <TableHead className="text-center">Quote</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {photographers.map((photographer) => {
                  const profileStatus = ProfileCompletenessService.checkProfile(photographer as any);
                  const missingFieldsMap = ProfileCompletenessService.groupMissingFieldsBySection(profileStatus.missingFields);
                  
                  return (
                  <TableRow key={photographer.user_id}>
                    <TableCell className="font-medium">
                      {photographer.vorname} {photographer.nachname}
                    </TableCell>
                    <TableCell className="text-sm">{photographer.email}</TableCell>
                    
                    {/* Profile Status */}
                    <TableCell>
                      {profileStatus.isComplete ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Einsatzbereit
                        </Badge>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs cursor-help">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Unvollständig ({profileStatus.completionPercentage}%)
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <div className="text-xs space-y-1">
                                <p className="font-semibold">Fehlende Informationen:</p>
                                {Array.from(missingFieldsMap.entries()).map(([section, fields]) => (
                                  <div key={section}>
                                    <p className="font-medium">{section}:</p>
                                    <p className="text-muted-foreground">{fields.join(', ')}</p>
                                  </div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </TableCell>
                    
                    {/* Tax Status */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {photographer.kleinunternehmer && (
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
                            Kleinunternehmer §19
                          </Badge>
                        )}
                        {photographer.umsatzsteuer_pflichtig && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs cursor-help">
                                  USt-pflichtig
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs">
                                  {photographer.umsatzsteuer_id && <p>USt-IdNr: {photographer.umsatzsteuer_id}</p>}
                                  {photographer.steuernummer && <p>Steuernr: {photographer.steuernummer}</p>}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {!photographer.kleinunternehmer && !photographer.umsatzsteuer_pflichtig && (
                          <span className="text-xs text-muted-foreground">Nicht hinterlegt</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Insurance Status */}
                    <TableCell>
                      {photographer.berufshaftpflicht_bis ? (
                        isInsuranceExpired(photographer.berufshaftpflicht_bis) ? (
                          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 text-xs animate-pulse">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Abgelaufen!
                          </Badge>
                        ) : isInsuranceExpiringSoon(photographer.berufshaftpflicht_bis) ? (
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Läuft bald ab
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Gültig bis {new Date(photographer.berufshaftpflicht_bis).toLocaleDateString('de-DE')}
                          </Badge>
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground">Nicht hinterlegt</span>
                      )}
                    </TableCell>

                    {/* Banking Status */}
                    <TableCell>
                      {isBankingComplete(photographer) ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-xs cursor-help">
                                <CreditCard className="h-3 w-3 mr-1" />
                                Vollständig
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs space-y-1">
                                <p className="font-medium">{photographer.kontoinhaber}</p>
                                <p className="font-mono">{maskIBAN(photographer.iban)}</p>
                                {photographer.bic && <p>BIC: {photographer.bic}</p>}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Fehlt
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-center text-sm">
                      {photographer.total_assignments}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                        {photographer.accepted}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">
                        {photographer.declined}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`${getAcceptanceRateBadge(photographer.acceptance_rate)} text-xs`}
                      >
                        {photographer.acceptance_rate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onResendPasswordReset(photographer.user_id)}
                          title="Passwort-Reset erneut senden"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(photographer.user_id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemove(photographer.user_id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <UserMinus className="h-4 w-4" />
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
