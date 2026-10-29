import type { 
  AnalyzePayload, 
  EmailAnalysisResult, 
  HistoryListResponse, 
  HistoryItem, 
  DashboardStats, 
  FeedbackPayload 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        }
      } catch {
        // Fallback
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async checkHealth(): Promise<{ status: string; service: string }> {
    return this.request('/health');
  }

  async analyzeEmail(payload: AnalyzePayload): Promise<EmailAnalysisResult> {
    return this.request('/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.request('/dashboard/stats');
  }

  async getHistory(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    classification?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}): Promise<HistoryListResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.pageSize) query.append('page_size', params.pageSize.toString());
    if (params.search) query.append('search', params.search);
    if (params.classification && params.classification !== 'all') {
      query.append('classification', params.classification);
    }
    if (params.sortBy) query.append('sort_by', params.sortBy);
    if (params.sortOrder) query.append('sort_order', params.sortOrder);

    const qs = query.toString();
    return this.request(`/history${qs ? `?${qs}` : ''}`);
  }

  async getHistoryById(id: number | string): Promise<HistoryItem> {
    return this.request(`/history/${id}`);
  }

  async deleteHistory(id: number | string): Promise<{ success: boolean; message: string }> {
    return this.request(`/history/${id}`, {
      method: 'DELETE',
    });
  }

  async clearAllHistory(): Promise<{ success: boolean; message: string; count: number }> {
    return this.request('/history', {
      method: 'DELETE',
    });
  }

  async submitFeedback(payload: FeedbackPayload): Promise<{ success: boolean; message: string }> {
    return this.request('/feedback', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const api = new ApiService();
