import { Helmet } from 'react-helmet-async';
import MyProjectsSection from '../components/dashboard/MyProjectsSection';

const MyProjectsPage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <Helmet>
        <title>My Projects - SkillSynergy</title>
      </Helmet>
      <MyProjectsSection />
    </div>
  );
};

export default MyProjectsPage;
