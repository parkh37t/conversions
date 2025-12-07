export type GroupType = '기획그룹' | '디자인그룹' | '퍼블리싱그룹';

export type ProjectStatus = '진행중' | '대기' | '완료';

export interface Member {
  id: string;
  name: string;
  group: GroupType;
  role: string;
  email: string;
}

export interface ProjectMember {
  memberId: string;
  member: Member;
  role: string;
  startDate: string;
  endDate: string;
  allocationRate: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  members: ProjectMember[];
  budget?: number;
  client?: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalMembers: number;
  averageAllocation: number;
}
