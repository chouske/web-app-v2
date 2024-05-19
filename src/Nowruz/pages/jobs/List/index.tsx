import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { JobsRes } from 'src/core/api';
import { Icon } from 'src/Nowruz/general/Icon';
import { Button } from 'src/Nowruz/modules/general/components/Button';
import { JobsListing } from 'src/Nowruz/modules/Jobs/modules/JobListing';
import { SavedJobListing } from 'src/Nowruz/modules/Jobs/modules/savedJobListing';

import css from './list.module.scss';

export const JobsList = () => {
  const userJobs = useLoaderData() as JobsRes;

  const path = useLocation().pathname;
  const savedPage = path.includes('saved');
  const navigate = useNavigate();

  const saveButton = (
    <Button
      variant="outlined"
      color="primary"
      customStyle="flex gap-2 !text-sm !py-0"
      onClick={() => navigate('/jobs/saved')}
    >
      <Icon name="bookmark" fontSize={20} />
      Saved jobs
    </Button>
  );
  return (
    <div className={css.container}>
      <div className={css.header}>
        <div className="flex justify-between items-start">
          <h1 className={css.title}>{savedPage ? 'Saved jobs' : `${userJobs?.total_count} impact jobs`}</h1>
          {!savedPage && <div className="hidden md:block">{saveButton}</div>}
        </div>
        <h2 className={css.subtitle}>
          {savedPage ? 'Your saved jobs' : `Find work that matters to you and the world`}
        </h2>
        {!savedPage && <div className="block md:hidden mt-3">{saveButton}</div>}
      </div>

      <div className={css.list}>{savedPage ? <SavedJobListing /> : <JobsListing />}</div>
    </div>
  );
};
