import { useState, useEffect } from 'react';
import { 
  useGetAllergensQuery,
  useGetMedicalConditionsQuery, 
  useGetMedicationsQuery 
} from '../../../api/lookupDataApi';

const useDropdownData = (type, searchTerm = '', page = 0, itemsPerPage = 6, open = false) => {
  const [data, setData] = useState({
    items: [],
    loading: false,
    error: null,
    totalPages: 0,
    totalCount: 0
  });

  const getQueryHook = (type) => {
    const queries = {
      medication: useGetMedicationsQuery,
      disease: useGetMedicalConditionsQuery,
      allergy: useGetAllergensQuery
    };
    return queries[type] || useGetMedicationsQuery;
  };

  const QueryHook = getQueryHook(type);
  
  const { 
    data: response, 
    isLoading, 
    isFetching,
    error 
  } = QueryHook(
    { 
      searchValue: searchTerm, 
      pageNumber: page + 1,
      pageSize: itemsPerPage 
    },
    {
      skip: !open,
      refetchOnMountOrArgChange: false, 
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );

  const [cache, setCache] = useState({});

  useEffect(() => {
    if (response && response.succeeded) {
      const cacheKey = `${type}-${searchTerm}-${page}-${itemsPerPage}`;
      
      setCache(prev => ({
        ...prev,
        [cacheKey]: {
          items: response.data || [],
          totalPages: response.totalPages || 1,
          totalCount: response.totalCount || 0,
          timestamp: Date.now()
        }
      }));

      setData({
        items: response.data || [],
        loading: false,
        error: null,
        totalPages: response.totalPages || 1,
        totalCount: response.totalCount || 0
      });
    }
  }, [response, type, searchTerm, page, itemsPerPage]);

  useEffect(() => {
    if (!open) return;
    setData(prev => ({ 
      ...prev, 
      loading: isLoading || isFetching 
    }));
  }, [isLoading, isFetching, open]);

  useEffect(() => {
    if (error) {
      console.error(`Error fetching ${type}:`, error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message || `Failed to load ${type}`,
        items: []
      }));
    }
  }, [error, type]);

  return data;
};

export default useDropdownData;