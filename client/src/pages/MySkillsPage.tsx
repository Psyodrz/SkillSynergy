import { Helmet } from 'react-helmet-async';
import MySkillsSection from '../components/dashboard/MySkillsSection';

const MySkillsPage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <Helmet>
        <title>My Skills - SkillSynergy</title>
      </Helmet>
      <MySkillsSection />
    </div>
  );
};

export default MySkillsPage;
