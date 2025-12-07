import { Project, DashboardStats } from '../types';
import { AllocationChart, MemberAllocationChart } from './AllocationChart';
import { TrendingUp, FolderKanban, Users, Activity } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  onProjectSelect: (projectId: string) => void;
}

export const Dashboard = ({ projects, onProjectSelect }: DashboardProps) => {
  const stats: DashboardStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === '진행중').length,
    totalMembers: new Set(projects.flatMap(p => p.members.map(m => m.memberId))).size,
    averageAllocation:
      projects.reduce((sum, p) => sum + p.members.reduce((s, m) => s + m.allocationRate, 0), 0) /
      Math.max(1, projects.reduce((sum, p) => sum + p.members.length, 0)),
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case '진행중':
        return 'bg-green-100 text-green-800';
      case '대기':
        return 'bg-yellow-100 text-yellow-800';
      case '완료':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">전체 프로젝트</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
            <FolderKanban className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">진행중 프로젝트</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeProjects}</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">투입 구성원</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">평균 가동률</p>
              <p className="text-2xl font-bold text-blue-600">{stats.averageAllocation.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AllocationChart projects={projects} />
        <MemberAllocationChart projects={projects} />
      </div>

      {/* Projects List */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">프로젝트 목록</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  프로젝트명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  기간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  구성원
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  클라이언트
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map(project => (
                <tr
                  key={project.id}
                  onClick={() => onProjectSelect(project.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                    <div className="text-sm text-gray-500 md:hidden">{project.client}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {project.startDate} ~ {project.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.members.length}명
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {project.client || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
