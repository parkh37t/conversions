import { useState } from 'react';
import { Member, Project, GroupType } from '../types';
import { Plus, Search, Mail, Briefcase, Filter } from 'lucide-react';

interface MemberManagementProps {
  members: Member[];
  projects: Project[];
  onAddMember?: (member: Member) => void;
}

const GROUP_BADGE_CLASSES = {
  '기획그룹': 'badge-planning',
  '디자인그룹': 'badge-design',
  '퍼블리싱그룹': 'badge-publishing',
};

export const MemberManagement = ({ members, projects }: MemberManagementProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<GroupType | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const getMemberAllocation = (memberId: string) => {
    let total = 0;
    projects.forEach(project => {
      const memberProject = project.members.find(pm => pm.memberId === memberId);
      if (memberProject) {
        total += memberProject.allocationRate;
      }
    });
    return total;
  };

  const getMemberProjects = (memberId: string) => {
    return projects.filter(project =>
      project.members.some(pm => pm.memberId === memberId)
    );
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || member.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const groupStats = {
    '기획그룹': members.filter(m => m.group === '기획그룹').length,
    '디자인그룹': members.filter(m => m.group === '디자인그룹').length,
    '퍼블리싱그룹': members.filter(m => m.group === '퍼블리싱그룹').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">구성원 관리</h2>
            <p className="text-gray-600 mt-1">전체 {members.length}명</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            구성원 추가
          </button>
        </div>
      </div>

      {/* Group Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(groupStats).map(([group, count]) => (
          <div key={group} className="card">
            <div className="flex items-center justify-between">
              <div>
                <span className={`badge ${GROUP_BADGE_CLASSES[group as keyof typeof GROUP_BADGE_CLASSES]}`}>
                  {group}
                </span>
                <p className="text-2xl font-bold text-gray-900 mt-2">{count}명</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="이름, 이메일, 역할로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value as GroupType | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">전체 그룹</option>
              <option value="기획그룹">기획그룹</option>
              <option value="디자인그룹">디자인그룹</option>
              <option value="퍼블리싱그룹">퍼블리싱그룹</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map(member => {
          const allocation = getMemberAllocation(member.id);
          const memberProjects = getMemberProjects(member.id);

          return (
            <div key={member.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
                <span className={`badge ${GROUP_BADGE_CLASSES[member.group]}`}>
                  {member.group}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {member.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {memberProjects.length}개 프로젝트
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">총 가동률</span>
                  <span className={`text-sm font-semibold ${
                    allocation > 100 ? 'text-red-600' :
                    allocation > 80 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {allocation}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      allocation > 100 ? 'bg-red-600' :
                      allocation > 80 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(allocation, 100)}%` }}
                  ></div>
                </div>
              </div>

              {memberProjects.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">참여 프로젝트</p>
                  <div className="space-y-1">
                    {memberProjects.slice(0, 2).map(project => (
                      <div key={project.id} className="text-xs text-gray-700 truncate">
                        • {project.name}
                      </div>
                    ))}
                    {memberProjects.length > 2 && (
                      <div className="text-xs text-primary-600">
                        +{memberProjects.length - 2}개 더보기
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};
