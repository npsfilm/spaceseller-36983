import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface WeekdaySelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

const WEEKDAYS = [
  { value: 1, label: "Mo" },
  { value: 2, label: "Di" },
  { value: 3, label: "Mi" },
  { value: 4, label: "Do" },
  { value: 5, label: "Fr" },
  { value: 6, label: "Sa" },
  { value: 7, label: "So" },
];

export const WeekdaySelector = ({ selectedDays, onChange }: WeekdaySelectorProps) => {
  const handleToggle = (day: number) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day].sort());
    }
  };

  return (
    <div className="flex gap-4">
      {WEEKDAYS.map(({ value, label }) => (
        <div key={value} className="flex items-center gap-2">
          <Checkbox
            id={`weekday-${value}`}
            checked={selectedDays.includes(value)}
            onCheckedChange={() => handleToggle(value)}
          />
          <Label htmlFor={`weekday-${value}`} className="cursor-pointer font-medium">
            {label}
          </Label>
        </div>
      ))}
    </div>
  );
};
