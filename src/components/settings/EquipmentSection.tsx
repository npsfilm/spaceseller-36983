import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface EquipmentItem {
  category: string;
  item: string;
}

interface EquipmentSectionProps {
  equipment: EquipmentItem[];
  onChange: (equipment: EquipmentItem[]) => void;
}

const EQUIPMENT_CATEGORIES = [
  { value: "kamera", label: "Kamera" },
  { value: "objektive", label: "Objektive" },
  { value: "drohne", label: "Drohne" },
  { value: "beleuchtung", label: "Beleuchtung" },
  { value: "stativ", label: "Stativ" },
  { value: "zubehoer", label: "Zubehör" },
  { value: "sonstiges", label: "Sonstiges" },
];

export const EquipmentSection = ({ equipment, onChange }: EquipmentSectionProps) => {
  const [newCategory, setNewCategory] = useState("kamera");
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...equipment, { category: newCategory, item: newItem.trim() }]);
      setNewItem("");
      setNewCategory("kamera");
    }
  };

  const handleRemove = (index: number) => {
    onChange(equipment.filter((_, i) => i !== index));
  };

  const getCategoryLabel = (categoryValue: string) => {
    return EQUIPMENT_CATEGORIES.find(c => c.value === categoryValue)?.label || categoryValue;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Ausrüstung</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Fügen Sie Ihre fotografische Ausrüstung hinzu
        </p>
      </div>

      {/* Existing equipment items */}
      {equipment.length > 0 && (
        <div className="space-y-2">
          {equipment.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-muted px-3 py-1 rounded-md text-sm font-medium min-w-[120px]">
                      {getCategoryLabel(item.category)}
                    </div>
                    <div className="text-sm flex-1">{item.item}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add new equipment */}
      <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
        <Label className="text-sm font-medium">Neues Gerät hinzufügen</Label>
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-3">
          <Select value={newCategory} onValueChange={setNewCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EQUIPMENT_CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="z.B. Canon EOS R5, Sony 24-70mm f/2.8..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
          />

          <Button onClick={handleAdd} disabled={!newItem.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Hinzufügen
          </Button>
        </div>
      </div>
    </div>
  );
};

