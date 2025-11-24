import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { FileImage, Download } from 'lucide-react';
import { orderFileService } from '@/lib/services/OrderFileService';

interface FileGalleryProps {
  files: Array<{
    id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    uploaded_at: string | null;
  }>;
}

export const FileGallery = ({ files }: FileGalleryProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImage = (fileType: string): boolean => {
    return fileType.startsWith('image/');
  };

  const handlePreview = async (file: typeof files[0]) => {
    if (isImage(file.file_type)) {
      const url = await orderFileService.getFilePreviewUrl(file.file_path, 'order-uploads');
      if (url) {
        setPreviewUrl(url);
        setSelectedFile(file.id);
      }
    }
  };

  const handleDownload = async (file: typeof files[0]) => {
    try {
      await orderFileService.downloadFile(file.file_path, file.file_name);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <Card key={file.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <FileImage className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" title={file.file_name}>
                  {file.file_name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(file.file_size)}
                </p>
                {file.uploaded_at && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(file.uploaded_at).toLocaleDateString('de-DE')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              {isImage(file.file_type) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(file)}
                  className="flex-1"
                >
                  Vorschau
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(file)}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={() => {
        setSelectedFile(null);
        setPreviewUrl(null);
      }}>
        <DialogContent className="max-w-4xl">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="File preview"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
