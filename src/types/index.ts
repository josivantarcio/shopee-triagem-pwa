export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  identification: string;
  createdAt: string;
}

export interface Route {
  id: string;
  name: string;
  code: string;
  deliveryPersonIds: string[];
  neighborhoods: string[];
  streets: string[];
  createdAt: string;
}

export interface AppData {
  deliveryPersons: DeliveryPerson[];
  routes: Route[];
  version: string;
}

export interface ScanResult {
  route: Route;
  deliveryPersons: DeliveryPerson[];
  matchType: 'neighborhood' | 'street' | 'partial';
  confidence: number;
  matchedLocation: string;
}

export interface MatchScore {
  routeId: string;
  score: number;
  matchType: 'neighborhood' | 'street' | 'partial';
  matchedLocation: string;
}