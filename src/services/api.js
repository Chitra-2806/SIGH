/**
 * Dedicated API Service Layer for LegalMetriX
 * SIH26034 — Legal Metrology (Packaged Commodities) Rules, 2011 Compliance System
 *
 * This layer abstracts all backend calls. In development it provides realistic
 * mock data and simulated latencies. For production, simply set API_CONFIG.USE_MOCK = false
 * and set API_CONFIG.BASE_URL to point to your team's backend REST API.
 */

export * from './api.ts';
export { default } from './api.ts';

