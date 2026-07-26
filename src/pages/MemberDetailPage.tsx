import { useParams, useNavigate, Navigate } from 'react-router-dom';
import MemberPage from '../components/MemberPage';
import { members } from '../data/members';

export default function MemberDetailPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const member = members.find((m) => m.name === name);
  if (!member) {
    return <Navigate to="/team" replace />;
  }

  return <MemberPage member={member} onBack={() => navigate('/team')} />;
}
