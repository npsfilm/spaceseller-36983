import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Plus, ChevronDown, Trash2, ExternalLink, Shield, User, Camera, Globe, FileCheck, FileText, Image } from "lucide-react";

interface PageTrackingItem {
  id: string;
  url_handle: string;
  title: string;
  user_type: 'admin' | 'client' | 'photographer' | 'public';
  page_created: boolean;
  text_finalized: boolean;
  pictures_finalized: boolean;
  notes: string | null;
}

type UserType = 'admin' | 'client' | 'photographer' | 'public';

const USER_TYPE_CONFIG: Record<UserType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  admin: { label: 'Admin Seiten', icon: Shield },
  client: { label: 'Kunden Seiten', icon: User },
  photographer: { label: 'Fotografen Seiten', icon: Camera },
  public: { label: 'Öffentliche Seiten', icon: Globe },
};

export default function PageOverview() {
  const [pages, setPages] = useState<PageTrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPage, setNewPage] = useState({ url_handle: '', title: '', user_type: 'public' as UserType });
  const [expandedSections, setExpandedSections] = useState<Record<UserType, boolean>>({
    admin: true,
    client: true,
    photographer: true,
    public: true,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const { data, error } = await supabase
      .from('page_tracking')
      .select('*')
      .order('title', { ascending: true });

    if (!error && data) {
      setPages(data as PageTrackingItem[]);
    }
    setLoading(false);
  };

  const addPage = async () => {
    if (!newPage.url_handle || !newPage.title) return;

    const { error } = await supabase
      .from('page_tracking')
      .insert({
        url_handle: newPage.url_handle,
        title: newPage.title,
        user_type: newPage.user_type,
      });

    if (!error) {
      setNewPage({ url_handle: '', title: '', user_type: 'public' });
      setDialogOpen(false);
      fetchPages();
    }
  };

  const updateCheckbox = async (id: string, field: 'page_created' | 'text_finalized' | 'pictures_finalized', value: boolean) => {
    const { error } = await supabase
      .from('page_tracking')
      .update({ [field]: value })
      .eq('id', id);

    if (!error) {
      setPages(pages.map(p => p.id === id ? { ...p, [field]: value } : p));
    }
  };

  const deletePage = async (id: string) => {
    const { error } = await supabase
      .from('page_tracking')
      .delete()
      .eq('id', id);

    if (!error) {
      setPages(pages.filter(p => p.id !== id));
    }
  };

  const toggleSection = (userType: UserType) => {
    setExpandedSections(prev => ({ ...prev, [userType]: !prev[userType] }));
  };

  const groupedPages = pages.reduce((acc, page) => {
    if (!acc[page.user_type]) acc[page.user_type] = [];
    acc[page.user_type].push(page);
    return acc;
  }, {} as Record<UserType, PageTrackingItem[]>);

  const stats = {
    total: pages.length,
    completed: pages.filter(p => p.page_created && p.text_finalized && p.pictures_finalized).length,
    inProgress: pages.filter(p => (p.page_created || p.text_finalized || p.pictures_finalized) && !(p.page_created && p.text_finalized && p.pictures_finalized)).length,
    pending: pages.filter(p => !p.page_created && !p.text_finalized && !p.pictures_finalized).length,
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Seitenübersicht</h1>
            <p className="text-muted-foreground">Verfolge den Fortschritt aller Seiten</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Seite hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neue Seite hinzufügen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL / Handle</Label>
                  <Input
                    id="url"
                    placeholder="/beispiel-seite"
                    value={newPage.url_handle}
                    onChange={(e) => setNewPage({ ...newPage, url_handle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Titel</Label>
                  <Input
                    id="title"
                    placeholder="Seitentitel"
                    value={newPage.title}
                    onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userType">Benutzertyp</Label>
                  <Select
                    value={newPage.user_type}
                    onValueChange={(value: UserType) => setNewPage({ ...newPage, user_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="client">Kunde</SelectItem>
                      <SelectItem value="photographer">Fotograf</SelectItem>
                      <SelectItem value="public">Öffentlich</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addPage} className="w-full">
                  Hinzufügen
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Gesamt</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Fertig</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">In Arbeit</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-muted-foreground">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Ausstehend</p>
            </CardContent>
          </Card>
        </div>

        {/* Grouped Page Lists */}
        <div className="space-y-4">
          {(Object.keys(USER_TYPE_CONFIG) as UserType[]).map((userType) => {
            const config = USER_TYPE_CONFIG[userType];
            const Icon = config.icon;
            const typePages = groupedPages[userType] || [];

            return (
              <Collapsible
                key={userType}
                open={expandedSections[userType]}
                onOpenChange={() => toggleSection(userType)}
              >
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{config.label}</CardTitle>
                          <span className="text-sm text-muted-foreground">({typePages.length})</span>
                        </div>
                        <ChevronDown className={`h-5 w-5 transition-transform ${expandedSections[userType] ? 'rotate-180' : ''}`} />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      {typePages.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                          Keine Seiten in dieser Kategorie
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Titel</TableHead>
                              <TableHead>URL</TableHead>
                              <TableHead className="text-center w-24">
                                <div className="flex flex-col items-center">
                                  <FileCheck className="h-4 w-4" />
                                  <span className="text-xs">Seite</span>
                                </div>
                              </TableHead>
                              <TableHead className="text-center w-24">
                                <div className="flex flex-col items-center">
                                  <FileText className="h-4 w-4" />
                                  <span className="text-xs">Text</span>
                                </div>
                              </TableHead>
                              <TableHead className="text-center w-24">
                                <div className="flex flex-col items-center">
                                  <Image className="h-4 w-4" />
                                  <span className="text-xs">Bilder</span>
                                </div>
                              </TableHead>
                              <TableHead className="w-12"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {typePages.map((page) => (
                              <TableRow key={page.id}>
                                <TableCell className="font-medium">{page.title}</TableCell>
                                <TableCell>
                                  <a
                                    href={page.url_handle}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-primary hover:underline text-sm"
                                  >
                                    {page.url_handle}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Checkbox
                                    checked={page.page_created}
                                    onCheckedChange={(checked) => updateCheckbox(page.id, 'page_created', !!checked)}
                                  />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Checkbox
                                    checked={page.text_finalized}
                                    onCheckedChange={(checked) => updateCheckbox(page.id, 'text_finalized', !!checked)}
                                  />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Checkbox
                                    checked={page.pictures_finalized}
                                    onCheckedChange={(checked) => updateCheckbox(page.id, 'pictures_finalized', !!checked)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deletePage(page.id)}
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}