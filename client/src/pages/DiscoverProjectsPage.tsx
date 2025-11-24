import { Helmet } from 'react-helmet-async';
import DiscoverProjects from '../components/dashboard/DiscoverProjects';

const DiscoverProjectsPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Helmet>
        <title>Discover Projects - SkillSynergy</title>
      </Helmet>
      <DiscoverProjects />
    </div>
  );
};

export default DiscoverProjectsPage;
