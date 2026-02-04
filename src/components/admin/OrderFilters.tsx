import { CombinedFilters, StatusOption } from '@/components/shared';

interface OrderFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

const statusOptions: StatusOption[] = [
  { value: "all", label: "Alle Status" },
  { value: "submitted", label: "Eingereicht" },
  { value: "in_progress", label: "In Bearbeitung" },
  { value: "completed", label: "Abgeschlossen" },
  { value: "delivered", label: "Geliefert" },
  { value: "cancelled", label: "Storniert" }
];

export const OrderFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: OrderFiltersProps) => {
  return (
    <CombinedFilters
      search={{
        value: searchQuery,
        onChange: onSearchChange,
        placeholder: "Suche nach Bestellnummer, Email oder Firma..."
      }}
      status={{
        value: statusFilter,
        onChange: onStatusChange,
        options: statusOptions,
        variant: 'select',
        placeholder: "Status filtern"
      }}
    />
  );
};
