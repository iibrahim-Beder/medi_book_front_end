import { baseApi } from './baseApi';

// Transform functions for consistent data structure
const transformLookupData = (response, searchTerm = "") => {
  if (!response || !response.succeeded) {
    return {
      data: [],
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      searchTerm: searchTerm,
      succeeded: false
    };
  }

  if (!response.data) return {
    ...response,
    data: [],
    searchTerm: searchTerm
  };

  const transformedData = response.data.map(item => ({
    id: item.id,
    name: item.name,
    value: item.id, // For select components
    label: item.name // For select components
  }));

  return {
    ...response,
    data: transformedData,
    searchTerm: searchTerm
  };
};

const transformSingleLookupItem = (response) => {
  if (!response || !response.succeeded || !response.data) {
    return {
      succeeded: false,
      data: null,
      error: response?.error || 'Operation failed'
    };
  }

  return {
    succeeded: true,
    data: {
      id: response.data.id,
      name: response.data.name,
      value: response.data.id,
      label: response.data.name
    },
    message: response.message
  };
};

export const lookupDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Allergens
    getAllergens: builder.query({
      query: ({ 
        searchValue = '', 
        pageNumber = 1, 
        pageSize = 10 
      } = {}) => {
        const params = {
          ...(searchValue && { SearchValue: searchValue }),
          ...(pageNumber && { PageNumber: pageNumber }),
          ...(pageSize && { PageSize: pageSize })
        };

        console.log('Get Allergens Params:', params);

        return {
          url: '/Allergens/GetAllergens',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Allergens API Response:', response);
        return transformLookupData(response, args?.searchValue);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Allergens API Error:', response);
        return transformLookupData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }, 
          args?.searchValue
        );
      },
      providesTags: ['Allergens'],
    }),

    // Get Medical Conditions
    getMedicalConditions: builder.query({
      query: ({ 
        searchValue = '', 
        pageNumber = 1, 
        pageSize = 10 
      } = {}) => {
        const params = {
          ...(searchValue && { searchValue: searchValue }),
          ...(pageNumber && { PageNumber: pageNumber }),
          ...(pageSize && { PageSize: pageSize })
        };

        console.log('Get Medical Conditions Params:', params);

        return {
          url: '/MedicalConditions/GetMedicalConditions',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Medical Conditions API Response:', response);
        return transformLookupData(response, args?.searchValue);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Medical Conditions API Error:', response);
        return transformLookupData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }, 
          args?.searchValue
        );
      },
      providesTags: ['MedicalConditions'],
    }),

    // Get Medications
    getMedications: builder.query({
      query: ({ 
        searchValue = '', 
        pageNumber = 1, 
        pageSize = 10 
      } = {}) => {
        const params = {
          ...(searchValue && { searchValue: searchValue }),
          ...(pageNumber && { PageNumber: pageNumber }),
          ...(pageSize && { PageSize: pageSize })
        };

        console.log('Get Medications Params:', params);

        return {
          url: '/Medications/GetMedications',
          params,
          timeout: 10000
        };
      },
      transformResponse: (response, meta, args) => {
        console.log('Medications API Response:', response);
        return transformLookupData(response, args?.searchValue);
      },
      transformErrorResponse: (response, meta, args) => {
        console.error('Medications API Error:', response);
        return transformLookupData(
          { 
            succeeded: false, 
            error: response.data,
            status: response.status 
          }, 
          args?.searchValue
        );
      },
      providesTags: ['Medications'],
    }),

    // Lazy queries for on-demand fetching
    getMedicalConditionsLazy: builder.query({
      query: ({ 
        searchValue = '', 
        pageNumber = 1, 
        pageSize = 10 
      } = {}) => {
        const params = {
          ...(searchValue && { searchValue: searchValue }),
          ...(pageNumber && { PageNumber: pageNumber }),
          ...(pageSize && { PageSize: pageSize })
        };

        return {
          url: '/MedicalConditions/GetMedicalConditions',
          params,
          timeout: 10000
        };
      },
      transformResponse: transformLookupData,
    }),

    getAllergensLazy: builder.query({
      query: ({ 
        searchValue = '', 
        pageNumber = 1, 
        pageSize = 10 
      } = {}) => {
        const params = {
          ...(searchValue && { SearchValue: searchValue }),
          ...(pageNumber && { PageNumber: pageNumber }),
          ...(pageSize && { PageSize: pageSize })
        };

        return {
          url: '/Allergens/GetAllergens',
          params,
          timeout: 10000
        };
      },
      transformResponse: transformLookupData,
    }),

    getMedicationsLazy: builder.query({
      query: ({ 
        searchValue = '', 
        pageNumber = 1, 
        pageSize = 10 
      } = {}) => {
        const params = {
          ...(searchValue && { searchValue: searchValue }),
          ...(pageNumber && { PageNumber: pageNumber }),
          ...(pageSize && { PageSize: pageSize })
        };

        return {
          url: '/Medications/GetMedications',
          params,
          timeout: 10000
        };
      },
      transformResponse: transformLookupData,
    }),
  }),
});

export const {
  // Regular queries
  useGetAllergensQuery,
  useGetMedicalConditionsQuery,
  useGetMedicationsQuery,
  
  // Lazy queries
  useLazyGetAllergensQuery,
  useLazyGetMedicalConditionsQuery,
  useLazyGetMedicationsQuery,
  
  // Lazy queries with different names for specific use cases
  useGetMedicalConditionsLazyQuery,
  useGetAllergensLazyQuery,
  useGetMedicationsLazyQuery,
} = lookupDataApi;