import { Route, DeliveryPerson, ScanResult, MatchScore } from '../types';
import { storage } from './storage';

export class AddressParser {
  /**
   * Normalize text by removing accents, special characters, and converting to lowercase
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s]/g, '') // Remove special chars
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }

  /**
   * Calculate similarity between two strings using Levenshtein distance
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = this.normalizeText(str1);
    const s2 = this.normalizeText(str2);

    if (s1 === s2) return 100;
    if (s1.length === 0 || s2.length === 0) return 0;

    // Check if one string contains the other
    if (s1.includes(s2) || s2.includes(s1)) {
      return 85;
    }

    // Levenshtein distance calculation
    const matrix: number[][] = [];
    
    for (let i = 0; i <= s2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= s1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= s2.length; i++) {
      for (let j = 1; j <= s1.length; j++) {
        if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    const distance = matrix[s2.length][s1.length];
    const maxLength = Math.max(s1.length, s2.length);
    const similarity = ((maxLength - distance) / maxLength) * 100;
    
    return Math.round(similarity);
  }

  /**
   * Parse QR code data to extract address
   * Shopee QR codes typically contain address information
   */
  parseQRCode(qrData: string): string {
    // Try to extract address from QR data
    // This is a simplified version - adjust based on actual Shopee QR format
    
    // Check if it's a URL
    if (qrData.startsWith('http')) {
      try {
        const url = new URL(qrData);
        const address = url.searchParams.get('address') || 
                       url.searchParams.get('endereco') ||
                       qrData;
        return address;
      } catch {
        return qrData;
      }
    }
    
    // Check if it's JSON
    try {
      const parsed = JSON.parse(qrData);
      return parsed.address || parsed.endereco || parsed.destino || qrData;
    } catch {
      // Not JSON, return as is
      return qrData;
    }
  }

  /**
   * Find best matching routes for a given address
   */
  findBestMatch(address: string): ScanResult[] {
    const normalizedAddress = this.normalizeText(address);
    const routes = storage.getRoutes();
    const matchScores: MatchScore[] = [];

    // Process each route
    for (const route of routes) {
      let bestScore = 0;
      let bestMatchType: 'neighborhood' | 'street' | 'partial' = 'partial';
      let bestMatchLocation = '';

      // Check neighborhoods
      for (const neighborhood of route.neighborhoods) {
        const similarity = this.calculateSimilarity(normalizedAddress, neighborhood);
        if (similarity > bestScore) {
          bestScore = similarity;
          bestMatchType = 'neighborhood';
          bestMatchLocation = neighborhood;
        }
      }

      // Check streets
      for (const street of route.streets) {
        const similarity = this.calculateSimilarity(normalizedAddress, street);
        // Streets get a slight bonus
        const adjustedSimilarity = similarity > 0 ? similarity + 5 : 0;
        if (adjustedSimilarity > bestScore) {
          bestScore = adjustedSimilarity;
          bestMatchType = 'street';
          bestMatchLocation = street;
        }
      }

      // Only add if score is above threshold
      if (bestScore >= 60) {
        matchScores.push({
          routeId: route.id,
          score: Math.min(bestScore, 100),
          matchType: bestMatchType,
          matchedLocation: bestMatchLocation
        });
      }
    }

    // Sort by score (highest first) and match type priority
    matchScores.sort((a, b) => {
      // First by match type
      const typeOrder = { neighborhood: 3, street: 2, partial: 1 };
      const typeDiff = typeOrder[b.matchType] - typeOrder[a.matchType];
      if (typeDiff !== 0) return typeDiff;
      
      // Then by score
      return b.score - a.score;
    });

    // Convert to ScanResults
    const results: ScanResult[] = [];
    const deliveryPersons = storage.getDeliveryPersons();

    for (const match of matchScores.slice(0, 5)) { // Top 5 results
      const route = storage.getRouteById(match.routeId);
      if (!route) continue;

      const routeDeliveryPersons = route.deliveryPersonIds
        .map(id => deliveryPersons.find(dp => dp.id === id))
        .filter((dp): dp is DeliveryPerson => dp !== undefined);

      results.push({
        route,
        deliveryPersons: routeDeliveryPersons,
        matchType: match.matchType,
        confidence: match.score,
        matchedLocation: match.matchedLocation
      });
    }

    return results;
  }
}

export const addressParser = new AddressParser();