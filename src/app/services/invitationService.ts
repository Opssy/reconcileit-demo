// User invitation service
export interface InvitationData {
  email: string;
  role: string;
  invitedBy: string;
  expiresAt: Date;
}

interface InvitationDetails {
  role: string;
  company: string;
  country: string;
  sector: string;
}

export const invitationService = {
  async createInvitation(data: Omit<InvitationData, 'expiresAt'>): Promise<{ success: boolean; invitationId: string; message: string }> {
    // Simulate API call - replace with actual implementation
    console.log('Creating invitation for:', data);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo purposes, always succeed
    return {
      success: true,
      invitationId: `invite-${Date.now()}`,
      message: 'Invitation sent successfully!'
    };
  },

  async validateInvitation(email: string): Promise<{
    success: boolean;
    isValid: boolean;
    role?: string;
    company?: string;
    country?: string;
    sector?: string;
    message: string;
  }> {
    // Simulate API call - replace with actual implementation
    console.log('Validating invitation for:', email);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock validation logic - in a real app, this would check against a database
    // For demo purposes, let's simulate finding an invitation for some emails
    const mockInvitations: Record<string, InvitationDetails> = {
      'reviewer@company.com': {
        role: 'Reviewer',
        company: 'TechCorp',
        country: 'Nigeria',
        sector: 'Technology'
      },
      'manager@business.com': {
        role: 'Manager',
        company: 'BusinessCorp',
        country: 'Nigeria',
        sector: 'Banking'
      }
    };

    const invitation = mockInvitations[email];

    if (invitation) {
      return {
        success: true,
        isValid: true,
        role: invitation.role,
        company: invitation.company,
        country: invitation.country,
        sector: invitation.sector,
        message: 'Valid invitation found'
      };
    }

    return {
      success: true,
      isValid: false,
      message: 'No invitation found for this email'
    };
  },
};
