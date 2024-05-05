import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData, useLocation } from 'react-router-dom';
import {
  CurrentIdentity,
  Job,
  JobsRes,
  Skill,
  UserMeta,
  jobs,
  markedJobs,
  recommendedJobs,
  skills,
} from 'src/core/api';
import { isTouchDevice } from 'src/core/device-type-detector';
import { useIsMount } from 'src/Nowruz/modules/general/components/useIsMount';
import { RootState } from 'src/store';
import { setSkills } from 'src/store/reducers/skills.reducer';

export const useJobListing = () => {
  const loaderData = useLoaderData() as JobsRes;
  const skillList = useSelector<RootState, Skill[]>(state => {
    return state.skills.items;
  });

  const currentIdentity = useSelector<RootState, CurrentIdentity | undefined>(state =>
    state.identity.entities.find(identity => identity.current),
  );

  const path = useLocation().pathname;
  const savedPage = path.includes('saved');
  const dispatch = useDispatch();
  const PER_PAGE = 10;
  const isMobile = isTouchDevice();
  const [jobsList, setJobsList] = useState<Job[]>(loaderData.items);
  const [totalCount, setTotalCount] = useState(loaderData.total_count);
  const pageNumber = Number(loaderData.page);
  const [page, setPage] = useState(pageNumber);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState<Job>();
  const isMount = useIsMount();

  const loadPage = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchMore(), getSkills(), getRecommended()]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchMore = async () => {
    if (!isMount) {
      const data = savedPage
        ? await markedJobs({ page: page, 'filter.marked_as': 'SAVE', limit: 5 })
        : await jobs({ page: page, status: 'ACTIVE', limit: PER_PAGE });
      setTotalCount(data.total_count);
      if (isMobile && page > 1) setJobsList([...jobsList, ...data.items]);
      else setJobsList(data.items);
    }
  };

  const getSkills = async () => {
    if (skillList.length) return;
    const res = await skills({ limit: 500 });
    await dispatch(setSkills(res.items));
  };

  const getRecommended = async () => {
    if (!currentIdentity) return;
    // const res = await recommendedJobs((currentIdentity.meta as UserMeta).username)
    const res = await jobs({ page: page, status: 'ACTIVE', limit: 1 });
    setRecommended(res.items[0]);
  };

  useEffect(() => {
    loadPage();
    localStorage.setItem('page', page.toString());
  }, [page]);
  return { page, setPage, jobsList, total: totalCount, PER_PAGE, isMobile, skillList, loading, savedPage, recommended };
};
