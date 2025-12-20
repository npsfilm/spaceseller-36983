import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { FileText, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import type { PageSeo } from '@/types/siteSettings';
import { adminSettingsContent } from '@/config/content/adminSettingsContent';

const content = adminSettingsContent.pages;

interface PageSeoTabProps {
  pages: PageSeo[];
  saving: boolean;
  onUpdate: (pageId: string, updates: Partial<PageSeo>) => Promise<boolean>;
  onCreate: (data: Omit<PageSeo, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  onDelete: (pageId: string) => Promise<boolean>;
}

export function PageSeoTab({ pages, saving, onUpdate, onCreate, onDelete }: PageSeoTabProps) {
  const [editingPage, setEditingPage] = useState<PageSeo | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPage, setNewPage] = useState({
    page_path: '',
    page_name: '',
    title: '',
    description: '',
    keywords: [] as string[],
    no_index: false,
    no_follow: false,
    priority: 0.5,
    change_frequency: 'monthly'
  });
  const [keywordInput, setKeywordInput] = useState('');

  const handleEdit = (page: PageSeo) => {
    setEditingPage({ ...page });
  };

  const handleSaveEdit = async () => {
    if (!editingPage) return;
    
    const success = await onUpdate(editingPage.id, {
      title: editingPage.title,
      description: editingPage.description,
      keywords: editingPage.keywords,
      no_index: editingPage.no_index,
      no_follow: editingPage.no_follow,
      priority: editingPage.priority,
      change_frequency: editingPage.change_frequency
    });
    
    if (success) {
      setEditingPage(null);
    }
  };

  const handleCreate = async () => {
    const success = await onCreate({
      page_path: newPage.page_path,
      page_name: newPage.page_name,
      title: newPage.title || null,
      description: newPage.description || null,
      keywords: newPage.keywords.length > 0 ? newPage.keywords : null,
      og_image: null,
      structured_data: null,
      no_index: newPage.no_index,
      no_follow: newPage.no_follow,
      canonical_url: null,
      priority: newPage.priority,
      change_frequency: newPage.change_frequency
    });
    
    if (success) {
      setIsCreateDialogOpen(false);
      setNewPage({
        page_path: '',
        page_name: '',
        title: '',
        description: '',
        keywords: [],
        no_index: false,
        no_follow: false,
        priority: 0.5,
        change_frequency: 'monthly'
      });
    }
  };

  const handleAddKeyword = (isEdit: boolean) => {
    if (!keywordInput.trim()) return;
    
    if (isEdit && editingPage) {
      const currentKeywords = editingPage.keywords || [];
      if (!currentKeywords.includes(keywordInput.trim())) {
        setEditingPage({
          ...editingPage,
          keywords: [...currentKeywords, keywordInput.trim()]
        });
      }
    } else {
      if (!newPage.keywords.includes(keywordInput.trim())) {
        setNewPage(prev => ({
          ...prev,
          keywords: [...prev.keywords, keywordInput.trim()]
        }));
      }
    }
    setKeywordInput('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {content.sections.main.title}
              </CardTitle>
              <CardDescription>
                {content.sections.main.description}
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {content.actions.newPage}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{content.dialogs.create.title}</DialogTitle>
                  <DialogDescription>
                    {content.dialogs.create.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{content.fields.path.label}</Label>
                      <Input
                        value={newPage.page_path}
                        onChange={(e) => setNewPage(prev => ({ ...prev, page_path: e.target.value }))}
                        placeholder={content.fields.path.placeholder}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{content.fields.pageName.label}</Label>
                      <Input
                        value={newPage.page_name}
                        onChange={(e) => setNewPage(prev => ({ ...prev, page_name: e.target.value }))}
                        placeholder={content.fields.pageName.placeholder}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{content.fields.title.label}</Label>
                    <Input
                      value={newPage.title}
                      onChange={(e) => setNewPage(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={content.fields.title.placeholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{content.fields.description.label}</Label>
                    <Textarea
                      value={newPage.description}
                      onChange={(e) => setNewPage(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={content.fields.description.placeholder}
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newPage.no_index}
                        onCheckedChange={(checked) => setNewPage(prev => ({ ...prev, no_index: checked }))}
                      />
                      <Label>{content.fields.noIndex.label}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newPage.no_follow}
                        onCheckedChange={(checked) => setNewPage(prev => ({ ...prev, no_follow: checked }))}
                      />
                      <Label>{content.fields.noFollow.label}</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    {content.actions.cancel}
                  </Button>
                  <Button onClick={handleCreate} disabled={saving || !newPage.page_path || !newPage.page_name}>
                    {content.actions.create}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{content.table.headers.page}</TableHead>
                <TableHead>{content.table.headers.path}</TableHead>
                <TableHead>{content.table.headers.title}</TableHead>
                <TableHead>{content.table.headers.status}</TableHead>
                <TableHead className="text-right">{content.table.headers.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.page_name}</TableCell>
                  <TableCell className="font-mono text-sm">{page.page_path}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {page.title || <span className="text-muted-foreground">{content.table.status.default}</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {page.no_index && <Badge variant="outline">{content.table.status.noindex}</Badge>}
                      {page.no_follow && <Badge variant="outline">{content.table.status.nofollow}</Badge>}
                      {!page.no_index && !page.no_follow && (
                        <Badge variant="secondary">{content.table.status.indexed}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(page)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={() => onDelete(page.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{content.dialogs.edit.titlePrefix} {editingPage?.page_name}</DialogTitle>
            <DialogDescription>
              {editingPage?.page_path}
            </DialogDescription>
          </DialogHeader>
          {editingPage && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>
                  {content.fields.title.label}
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({(editingPage.title?.length || 0)}/60 {content.fields.title.charCount})
                  </span>
                </Label>
                <Input
                  value={editingPage.title || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  placeholder={content.fields.title.placeholder}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  {content.fields.description.label}
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({(editingPage.description?.length || 0)}/160 {content.fields.description.charCount})
                  </span>
                </Label>
                <Textarea
                  value={editingPage.description || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, description: e.target.value })}
                  placeholder={content.fields.description.placeholder}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>{content.fields.keywords.label}</Label>
                <div className="flex gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword(true))}
                    placeholder={content.fields.keywords.placeholder}
                  />
                  <Button type="button" variant="outline" onClick={() => handleAddKeyword(true)}>
                    +
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(editingPage.keywords || []).map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="gap-1">
                      {keyword}
                      <button onClick={() => setEditingPage({
                        ...editingPage,
                        keywords: editingPage.keywords?.filter(k => k !== keyword) || []
                      })}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingPage.no_index}
                    onCheckedChange={(checked) => setEditingPage({ ...editingPage, no_index: checked })}
                  />
                  <Label>{content.fields.noIndex.label}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingPage.no_follow}
                    onCheckedChange={(checked) => setEditingPage({ ...editingPage, no_follow: checked })}
                  />
                  <Label>{content.fields.noFollow.label}</Label>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{content.fields.priority.label}</Label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={editingPage.priority}
                    onChange={(e) => setEditingPage({ ...editingPage, priority: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{content.fields.changeFrequency.label}</Label>
                  <Input
                    value={editingPage.change_frequency}
                    onChange={(e) => setEditingPage({ ...editingPage, change_frequency: e.target.value })}
                    placeholder={content.fields.changeFrequency.placeholder}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPage(null)}>
              {content.actions.cancel}
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {content.actions.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
