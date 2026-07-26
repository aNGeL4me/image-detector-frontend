import { useNavigate } from 'react-router-dom';
import { members } from '../data/members';

export default function Team() {
  const navigate = useNavigate();

  return (
    <section id="team" className="section">
      <h2>团队介绍</h2>
      <p className="section-subtitle">来自人工智能与计算机视觉领域的研究者和工程师</p>
      <div className="team-grid">
        {members.map((member) => (
          <div
            key={member.name}
            className="team-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/team/${encodeURIComponent(member.name)}`)}
            onKeyDown={(e) =>
              e.key === 'Enter' && navigate(`/team/${encodeURIComponent(member.name)}`)
            }
          >
            <div className="avatar">{member.avatar}</div>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
