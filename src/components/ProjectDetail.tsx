import { Project } from '../types';
import { ArrowLeft, Calendar, DollarSign, Users, Briefcase } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

const GROUP_BADGE_CLASSES = {
  '기획그룹': 'badge-planning',
  '디자인그룹': 'badge-design',
  '퍼블리싱그룹': 'badge-publishing',
};

export const ProjectDetail = ({ project, onBack }: ProjectDetailProps) => {
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

  const groupedMembers = project.members.reduce((acc, pm) => {
    const group = pm.member.group;
    if (!acc[group]) acc[group] = [];
    acc[group].push(pm);
    return acc;
  }, {} as Record<string, typeof project.members>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <button
          onClick={onBack}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로
        </button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <span className={`badge ${getStatusBadgeClass(project.status)}`}>
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center text-gray-500 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">시작일</span>
          </div>
          <p className="text-lg font-semibold">{project.startDate}</p>
        </div>

        <div className="card">
          <div className="flex items-center text-gray-500 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">종료일</span>
          </div>
          <p className="text-lg font-semibold">{project.endDate}</p>
        </div>

        <div className="card">
          <div className="flex items-center text-gray-500 mb-2">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">투입 인원</span>
          </div>
          <p className="text-lg font-semibold">{project.members.length}명</p>
        </div>

        {project.budget && (
          <div className="card">
            <div className="flex items-center text-gray-500 mb-2">
              <DollarSign className="w-4 h-4 mr-2" />
              <span className="text-sm">예산</span>
            </div>
            <p className="text-lg font-semibold">
              {project.budget.toLocaleString()}원
            </p>
          </div>
        )}

        {project.client && (
          <div className="card">
            <div className="flex items-center text-gray-500 mb-2">
              <Briefcase className="w-4 h-4 mr-2" />
              <span className="text-sm">클라이언트</span>
            </div>
            <p className="text-lg font-semibold">{project.client}</p>
          </div>
        )}
      </div>

      {/* Team Members by Group */}
      {Object.entries(groupedMembers).map(([group, members]) => (
        <div key={group} className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className={`badge ${GROUP_BADGE_CLASSES[group as keyof typeof GROUP_BADGE_CLASSES]} mr-2`}>
              {group}
            </span>
            <span className="text-gray-500 text-sm font-normal">({members.length}명)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    역할
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    투입 기간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가동률
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map(pm => (
                  <tr key={pm.memberId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{pm.member.name}</div>
                      <div className="text-sm text-gray-500">{pm.member.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pm.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {pm.startDate} ~ {pm.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${pm.allocationRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {pm.allocationRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};
