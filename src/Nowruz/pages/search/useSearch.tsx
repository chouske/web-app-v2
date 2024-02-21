import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { Job, JobsRes, Organization, OrganizationsRes, User, UsersRes } from 'src/core/api';
import { search as searchReq } from 'src/core/api/site/site.api';
import { isTouchDevice } from 'src/core/device-type-detector';
import { removeValuesFromObject } from 'src/core/utils';
import ProfileCard from 'src/Nowruz/modules/general/components/profileCard';
import { JobListingCard } from 'src/Nowruz/modules/Jobs/components/JobListingCard';

type FilterReq = {
  causes_tags?: Array<string>;
  skills?: Array<string>;
  country?: Array<string>;
  city?: Array<string>;
  label?: { value: string; label: string; countryCode: string };
};

export const useSearch = () => {
  const data = useLoaderData() as JobsRes | UsersRes | OrganizationsRes;
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const q = searchParams.get('q');

  const PER_PAGE = 10;
  const isMobile = isTouchDevice();
  const [searchResult, setSearchResult] = useState({} as JobsRes | UsersRes | OrganizationsRes);
  const [page, setPage] = useState(1);
  const [sliderFilterOpen, setSliderFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterReq>({} as FilterReq);

  const filterNeeded = (filter: FilterReq) => {
    const propertyName = type === 'projects' ? 'causes_tags' : 'social_causes';
    return {
      [propertyName]: filter.causes_tags,
      skills: filter.skills,
      country: filter.country,
      city: filter.city,
    };
  };

  const fetchMore = async (page: number) => {
    const body = {
      filter: filter ? removeValuesFromObject(filterNeeded(filter), ['', null, undefined]) : {},
      type,
    } as any;
    if (q?.trim()) {
      Object.assign(body, { q });
    }
    const data = await searchReq(body, { limit: 10, page });
    if (isMobile && page > 1) setSearchResult({ ...searchResult, ...data });
    else setSearchResult(data);
  };

  const handleCloseOrApplyFilter = () => {
    setSliderFilterOpen(!sliderFilterOpen);
  };

  const onClose = () => {
    handleCloseOrApplyFilter();
  };

  const onApply = async (filterRaw: FilterReq) => {
    setFilter(filterRaw);
    handleCloseOrApplyFilter();
  };

  const readableType = useMemo(() => {
    if (type === 'projects') return 'jobs';
    if (type === 'users') return 'people';
    return 'organization';
  }, [type]);

  const card = useCallback(
    (item: Job | Organization | User) => {
      if (type && ['users', 'organizations'].includes(type)) {
        return <ProfileCard identity={item as User | Organization} labelShown={false} />;
      }
      return <JobListingCard job={item as Job} />;
    },
    [type],
  );

  useEffect(() => {
    fetchMore(page);
  }, [page, filter]);

  useEffect(() => {
    if (data.items.length) {
      setSearchResult(data);
      setFilter({});
    }
  }, [data]);

  return {
    data: {
      page,
      searchResult,
      total: searchResult.total_count ?? data.total_count,
      PER_PAGE,
      readableType,
      q,
      sliderFilterOpen,
      filter,
    },
    operations: {
      setPage,
      card,
      handleCloseOrApplyFilter,
      onApply,
      onClose,
    },
  };
};