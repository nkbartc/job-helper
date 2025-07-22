import { useState, useEffect } from 'react';

interface HiddenCompany {
  companyName: string;
  reason: string;
  hiddenAt: string;
}

export const useHiddenCompanies = () => {
  const [hiddenCompanies, setHiddenCompanies] = useState<HiddenCompany[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHiddenCompanies = async () => {
    try {
      setLoading(true);
      const result = await chrome.storage.local.get(['hiddenCompanies']);
      const companiesObject = result.hiddenCompanies || {};
      
      // Convert object to array
      const companiesArray = Object.entries(companiesObject).map(([companyName, data]: [string, any]) => ({
        companyName,
        reason: data.reason || 'No reason provided',
        hiddenAt: data.hiddenAt || new Date().toISOString()
      }));
      
      setHiddenCompanies(companiesArray);
    } catch (error) {
      console.error('Error loading hidden companies:', error);
      setHiddenCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const unhideCompany = async (companyName: string) => {
    try {
      const result = await chrome.storage.local.get(['hiddenCompanies']);
      const hiddenCompaniesObject = result.hiddenCompanies || {};
      const normalizedCompanyName = companyName.trim().toLowerCase();
      delete hiddenCompaniesObject[normalizedCompanyName];
      
      await chrome.storage.local.set({ hiddenCompanies: hiddenCompaniesObject });
      
      // Update local state
      setHiddenCompanies(prev => prev.filter(company => 
        company.companyName.toLowerCase() !== normalizedCompanyName
      ));
    } catch (error) {
      console.error('Error unhiding company:', error);
    }
  };

  useEffect(() => {
    loadHiddenCompanies();
  }, []);

  return {
    hiddenCompanies,
    loading,
    unhideCompany,
    loadHiddenCompanies
  };
}; 