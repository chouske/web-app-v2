import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Applicant, Job, jobApplicants } from 'src/core/api';
import { isoToStandard } from 'src/core/time';
import { Avatar } from 'src/Nowruz/modules/general/components/avatar/avatar';
import { Chip } from 'src/Nowruz/modules/general/components/Chip';

import css from './organization-job-card.module.scss';

interface OrganizationJobCardProps {
  job: Job;
}
export const OrganizationJobCard: React.FC<OrganizationJobCardProps> = ({ job }) => {
  const [applicants, setApplicants] = useState([] as Applicant[]);
  const isActive = job.status === 'ACTIVE';
  const startIcon = isActive ? <div className={css.dotIcon} /> : <></>;
  const label = isActive ? 'Active' : 'Stopped';
  const theme = isActive ? 'success' : 'error';
  const applicantsLabel = job.applicants === 1 ? 'applicant' : 'applicants';

  const getApplicants = async () => {
    const data = await jobApplicants(job.id, { page: 1, status: 'PENDING', limit: 100 });
    setApplicants(data.items);
  };

  useEffect(() => {
    getApplicants();
  }, [job]);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/nowruz/jobs/${job.id}`);
  };
  return (
    <div className={`${css.container} cursor-pointer`} onClick={handleClick}>
      <div className={css.cardInfo}>
        <div>
          <div className={css.intro}>
            <div className={css.left}>
              <div className={css.jobTitle}>{job.title}</div>
              <div className={css.subTitle}>Posted on {isoToStandard(job.updated_at?.toString() || '')}</div>
            </div>
            {/* <div>Action button placeholder</div> */}
          </div>
        </div>
        <div className={css.footer}>
          <div className={css.left}>
            <p className={css.applicants}>
              {!job.applicants ? 'No applicants' : `${job.applicants} ${applicantsLabel}`}
            </p>
            <div className={css.avatars}>
              {applicants.slice(0, 3).map((applicant) => (
                <div className={css.avatarItem}>
                  <Avatar type="users" size="20px" img={applicant.user.avatar as unknown as string} />
                </div>
              ))}
            </div>
          </div>
          <div className={css.right}>
            <Chip startIcon={startIcon} label={label} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
};