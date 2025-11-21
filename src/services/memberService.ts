import axios from 'axios';
import { api } from './api';

export interface Member {
  id: string;
  gymId: string;
  leadId?: string;
  planId?: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  address?: string;
  zipCode?: string;
  preferredWorkoutTime?: string;
  gymGoal?: string;
  email?: string;
  phone: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  planExpirationDate?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  gym?: {
    id: string;
    name: string;
  };
  plan?: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
  lead?: {
    id: string;
    name: string;
    phone: string;
  };
  approver?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateMemberData {
  gymId: string;
  leadId?: string;
  planId?: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  address?: string;
  zipCode?: string;
  preferredWorkoutTime?: string;
  gymGoal?: string;
  email?: string;
  phone: string;
}

export interface UpdateMemberData {
  planId?: string;
  fullName?: string;
  address?: string;
  zipCode?: string;
  preferredWorkoutTime?: string;
  gymGoal?: string;
  email?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  planExpirationDate?: string;
}

export interface MemberFilters {
  gymId?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface MemberListResponse {
  success: boolean;
  data: Member[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const memberService = {
  /**
   * Get all members with filtering
   */
  async getAllMembers(filters: MemberFilters = {}): Promise<MemberListResponse> {
    const params = new URLSearchParams();
    if (filters.gymId) params.append('gymId', filters.gymId);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const response = await axios.get<{ success: boolean; data: Member[]; pagination: any }>(
      `/api/members?${params.toString()}`,
      { skipAuthRedirect: false }
    );
    
    if (response.data.success && response.data.data && response.data.pagination) {
      return {
        success: response.data.success,
        data: response.data.data,
        pagination: response.data.pagination
      };
    }
    
    // Return empty response if structure is unexpected
    return {
      success: false,
      data: [],
      pagination: {
        total: 0,
        limit: 50,
        offset: 0,
        hasMore: false
      }
    };
  },

  /**
   * Get member by ID
   */
  async getMemberById(id: string): Promise<Member> {
    const response = await axios.get<{ success: boolean; data: Member }>(
      `/api/members/${id}`,
      { skipAuthRedirect: false }
    );
    return response.data.data;
  },

  /**
   * Create new member application
   */
  async createMember(data: CreateMemberData): Promise<Member> {
    const response = await axios.post<{ success: boolean; data: Member }>(
      '/api/members',
      data,
      { skipAuthRedirect: false }
    );
    return response.data.data;
  },

  /**
   * Update member
   */
  async updateMember(id: string, data: UpdateMemberData): Promise<Member> {
    const response = await axios.put<{ success: boolean; data: Member }>(
      `/api/members/${id}`,
      data,
      { skipAuthRedirect: false }
    );
    return response.data.data;
  },

  /**
   * Approve member application
   */
  async approveMember(id: string): Promise<Member> {
    const response = await axios.patch<{ success: boolean; data: Member }>(
      `/api/members/${id}/approve`,
      {},
      { skipAuthRedirect: false }
    );
    return response.data.data;
  },

  /**
   * Reject member application
   */
  async rejectMember(id: string): Promise<Member> {
    const response = await axios.patch<{ success: boolean; data: Member }>(
      `/api/members/${id}/reject`,
      {},
      { skipAuthRedirect: false }
    );
    return response.data.data;
  },

  /**
   * Delete member (soft delete)
   */
  async deleteMember(id: string): Promise<void> {
    await axios.delete(`/api/members/${id}`, {
      skipAuthRedirect: true
    });
  },

  /**
   * Get member statistics
   */
  async getStatistics(gymId?: string): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    active: number;
    inactive: number;
    expired: number;
  }> {
    const params = new URLSearchParams();
    if (gymId) params.append('gymId', gymId);

    const response = await axios.get<{ success: boolean; data: any }>(
      `/api/members/statistics?${params.toString()}`,
      { skipAuthRedirect: false }
    );
    return response.data.data;
  }
};

