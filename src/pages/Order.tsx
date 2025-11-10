import { ProtectedRoute } from '@/components/ProtectedRoute';
import { OrderWizard } from './Order/OrderWizard';

export default function Order() {
  return (
    <ProtectedRoute requireOnboarding>
      <OrderWizard />
    </ProtectedRoute>
  );
}
