export type Category = 'furniture' | 'appliance' | 'misc';
export type Condition = 'new' | 'good' | 'fair' | 'poor';
export type SizeHint = 'small' | 'medium' | 'large';

export type ListingCard = {
  id: string;
  locationText: string;
  category: Category;
  condition: Condition;
  sizeHint: SizeHint;
  status: string;
};

export type ListingFilters = Partial<{
  campusId: string;
  category: Category;
  condition: Condition;
  sizeHint: SizeHint;
  freshnessHours: number;
  radiusKm: number;
  excludeMattress: boolean;
  workingOnly: boolean;
  origin: { lat: number; lng: number };
}>;

export type SignalType = 'picked' | 'expired' | 'found';
export type SignalSource = 'user' | 'admin' | 'system';
