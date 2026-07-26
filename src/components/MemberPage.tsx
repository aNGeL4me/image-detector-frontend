import type { Member } from '../data/members';

interface MemberPageProps {
  member: Member;
  onBack: () => void;
}

export default function MemberPage({ member, onBack }: MemberPageProps) {
  return (
    <section className="section member-page">
      <button className="back-btn" onClick={onBack}>
        ← 返回团队
      </button>
      <div className="member-detail">
        <div className="avatar">{member.avatar}</div>
        <h2>{member.name}</h2>
        <p className="member-role">{member.role}</p>
        <p className="member-bio">{member.bio}</p>
        <div className="member-skills">
          {member.skills.map((skill) => (
            <span key={skill} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
