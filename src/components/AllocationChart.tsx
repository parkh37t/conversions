import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Project } from '../types';

interface AllocationChartProps {
  projects: Project[];
}

const GROUP_COLORS = {
  '기획그룹': '#3b82f6',
  '디자인그룹': '#a855f7',
  '퍼블리싱그룹': '#10b981',
};

export const AllocationChart = ({ projects }: AllocationChartProps) => {
  const chartData = projects.map(project => {
    const groupAllocations = {
      name: project.name,
      기획그룹: 0,
      디자인그룹: 0,
      퍼블리싱그룹: 0,
    };

    project.members.forEach(pm => {
      groupAllocations[pm.member.group] += pm.allocationRate;
    });

    return groupAllocations;
  });

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">프로젝트별 그룹 투입률</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
          <YAxis label={{ value: '투입률 (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="기획그룹" fill={GROUP_COLORS['기획그룹']} />
          <Bar dataKey="디자인그룹" fill={GROUP_COLORS['디자인그룹']} />
          <Bar dataKey="퍼블리싱그룹" fill={GROUP_COLORS['퍼블리싱그룹']} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface MemberAllocationProps {
  projects: Project[];
}

export const MemberAllocationChart = ({ projects }: MemberAllocationProps) => {
  const memberAllocations = new Map<string, { name: string; group: string; total: number }>();

  projects.forEach(project => {
    project.members.forEach(pm => {
      const existing = memberAllocations.get(pm.memberId);
      if (existing) {
        existing.total += pm.allocationRate;
      } else {
        memberAllocations.set(pm.memberId, {
          name: pm.member.name,
          group: pm.member.group,
          total: pm.allocationRate,
        });
      }
    });
  });

  const chartData = Array.from(memberAllocations.values()).sort((a, b) => b.total - a.total);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">구성원별 총 투입률</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" label={{ value: '총 투입률 (%)', position: 'insideBottom', offset: -5 }} />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip />
          <Bar dataKey="total">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={GROUP_COLORS[entry.group as keyof typeof GROUP_COLORS]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
