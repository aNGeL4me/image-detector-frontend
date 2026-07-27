import type { Member } from '../data/members';

interface MemberPageProps {
  member: Member;
  onBack: () => void;
}

export default function MemberPage({ member, onBack }: MemberPageProps) {
  return (
    <section className="section member-page">
      <div className="profile-container">
        <button className="back-btn" onClick={onBack}>
          ← 返回团队
        </button>

        {/* 板块一：个人资料卡 */}
        <div className="profile-card">
          <div className="profile-avatar">{member.avatar}</div>
          <div className="profile-info">
            <h2>{member.name}</h2>
            <p className="profile-role">{member.role}</p>
            <p className="profile-tagline">{member.tagline}</p>
            <div className="profile-links">
              {member.links.map((link) => (
                <a key={link.label} href={link.url} className="profile-link">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="profile-hobbies">
              {member.hobbies.map((hobby) => (
                <span key={hobby} className="hobby-tag">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 板块二：自我介绍 */}
        <div className="profile-section">
          <h3 className="profile-section-title">🙋 自我介绍</h3>
          {member.about.map((paragraph, i) => (
            <p key={i} className="profile-paragraph">
              {paragraph}
            </p>
          ))}
          <div className="member-skills">
            {member.skills.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 板块三：成果介绍 */}
        <div className="profile-section">
          <h3 className="profile-section-title">📚 成果介绍</h3>
          <div className="pub-list">
            {member.publications.map((pub) => (
              <div key={pub.title} className="pub-item">
                <div className="pub-thumbnail">{pub.thumbnail}</div>
                <div className="pub-body">
                  <h4 className="pub-title">{pub.title}</h4>
                  <p className="pub-authors">{pub.authors}</p>
                  <p className="pub-venue">
                    <em>{pub.venue}</em>, {pub.year}
                  </p>
                  <p className="pub-desc">{pub.description}</p>
                  <div className="pub-links">
                    {pub.links.map((link) => (
                      <a key={link.label} href={link.url} className="pub-link">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 板块四：个人履历 */}
        <div className="profile-section">
          <h3 className="profile-section-title">🎓 个人履历</h3>
          <div className="timeline">
            {member.experience.map((item) => (
              <div key={item.period} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-period">{item.period}</span>
                  <h4 className="timeline-title">{item.title}</h4>
                  <p className="timeline-org">{item.org}</p>
                  <p className="timeline-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
