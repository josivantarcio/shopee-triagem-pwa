import { AppData, DeliveryPerson, Route } from '../types';

const STORAGE_KEY = 'shopee-triagem-data';
const STORAGE_VERSION = '1.0.0';

const defaultData: AppData = {
  deliveryPersons: [],
  routes: [],
  version: STORAGE_VERSION
};

export const storage = {
  getData(): AppData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return defaultData;
      
      const parsed = JSON.parse(data) as AppData;
      
      // Migration logic if needed
      if (!parsed.version || parsed.version !== STORAGE_VERSION) {
        return { ...parsed, version: STORAGE_VERSION };
      }
      
      return parsed;
    } catch (error) {
      console.error('Error loading data:', error);
      return defaultData;
    }
  },

  saveData(data: AppData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
      throw new Error('Falha ao salvar dados. Verifique o espaço disponível.');
    }
  },

  exportData(): string {
    const data = this.getData();
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): void {
    try {
      const data = JSON.parse(jsonString) as AppData;
      
      // Validate structure
      if (!data.deliveryPersons || !Array.isArray(data.deliveryPersons)) {
        throw new Error('Estrutura inválida: deliveryPersons não encontrado');
      }
      if (!data.routes || !Array.isArray(data.routes)) {
        throw new Error('Estrutura inválida: routes não encontrado');
      }
      
      // Set version
      data.version = STORAGE_VERSION;
      
      this.saveData(data);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Arquivo JSON inválido. Verifique o formato.');
    }
  },

  clearData(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Delivery Persons
  getDeliveryPersons(): DeliveryPerson[] {
    return this.getData().deliveryPersons;
  },

  saveDeliveryPerson(person: Omit<DeliveryPerson, 'id' | 'createdAt'>): DeliveryPerson {
    const data = this.getData();
    const newPerson: DeliveryPerson = {
      ...person,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    data.deliveryPersons.push(newPerson);
    this.saveData(data);
    return newPerson;
  },

  updateDeliveryPerson(id: string, updates: Partial<DeliveryPerson>): void {
    const data = this.getData();
    const index = data.deliveryPersons.findIndex(p => p.id === id);
    if (index !== -1) {
      data.deliveryPersons[index] = { ...data.deliveryPersons[index], ...updates };
      this.saveData(data);
    }
  },

  deleteDeliveryPerson(id: string): void {
    const data = this.getData();
    data.deliveryPersons = data.deliveryPersons.filter(p => p.id !== id);
    
    // Remove from routes
    data.routes = data.routes.map(route => ({
      ...route,
      deliveryPersonIds: route.deliveryPersonIds.filter(dpId => dpId !== id)
    }));
    
    this.saveData(data);
  },

  // Routes
  getRoutes(): Route[] {
    return this.getData().routes;
  },

  saveRoute(route: Omit<Route, 'id' | 'createdAt'>): Route {
    const data = this.getData();
    const newRoute: Route = {
      ...route,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    data.routes.push(newRoute);
    this.saveData(data);
    return newRoute;
  },

  updateRoute(id: string, updates: Partial<Route>): void {
    const data = this.getData();
    const index = data.routes.findIndex(r => r.id === id);
    if (index !== -1) {
      data.routes[index] = { ...data.routes[index], ...updates };
      this.saveData(data);
    }
  },

  deleteRoute(id: string): void {
    const data = this.getData();
    data.routes = data.routes.filter(r => r.id !== id);
    this.saveData(data);
  },

  getDeliveryPersonById(id: string): DeliveryPerson | undefined {
    return this.getData().deliveryPersons.find(p => p.id === id);
  },

  getRouteById(id: string): Route | undefined {
    return this.getData().routes.find(r => r.id === id);
  }
};