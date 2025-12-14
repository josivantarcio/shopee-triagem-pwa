import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function downloadJSON(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Falha ao ler arquivo'));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return 'text-success';
  if (confidence >= 75) return 'text-warning';
  return 'text-destructive';
}

export function getConfidenceBadgeColor(confidence: number): string {
  if (confidence >= 90) return 'bg-success/10 text-success border-success/20';
  if (confidence >= 75) return 'bg-warning/10 text-warning border-warning/20';
  return 'bg-destructive/10 text-destructive border-destructive/20';
}

export function getMatchTypeBadgeColor(matchType: string): string {
  switch (matchType) {
    case 'neighborhood':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'street':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'partial':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export function getMatchTypeLabel(matchType: string): string {
  switch (matchType) {
    case 'neighborhood':
      return 'Bairro';
    case 'street':
      return 'Rua';
    case 'partial':
      return 'Parcial';
    default:
      return 'Desconhecido';
  }
}