// User Types
export enum UserRole {
  CLIENT = 'CLIENT',
  ADVERTISER = 'ADVERTISER',
  ADMIN = 'ADMIN',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum ModerationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum MediaType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
}

// DTOs
export interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateProfileDto {
  displayName: string;
  description?: string;
  location?: string;
  services?: any[];
  pricing?: any;
}

export interface UpdateProfileDto {
  displayName?: string;
  description?: string;
  location?: string;
  services?: any[];
  pricing?: any;
  availability?: any;
}

// Response Types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

export interface ProfileResponse {
  id: string;
  userId: string;
  displayName: string;
  description?: string;
  location?: string;
  verificationStatus: VerificationStatus;
  isActive: boolean;
  viewCount: number;
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}

// API Response Wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
