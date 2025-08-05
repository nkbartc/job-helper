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

  const updateReason = async (companyName: string, reason: string) => {
    try {
      const result = await chrome.storage.local.get(['hiddenCompanies']);
      const hiddenCompaniesObject = result.hiddenCompanies || {};
      const normalizedCompanyName = companyName.trim().toLowerCase();
      
      if (hiddenCompaniesObject[normalizedCompanyName]) {
        // Update existing entry
        hiddenCompaniesObject[normalizedCompanyName] = {
          ...hiddenCompaniesObject[normalizedCompanyName],
          reason: reason.trim(),
          updatedAt: new Date().toISOString()
        };
        
        await chrome.storage.local.set({ hiddenCompanies: hiddenCompaniesObject });
        await loadHiddenCompanies(); // Reload to refresh the display
      }
    } catch (error) {
      console.error('Error updating company reason:', error);
    }
  };

  useEffect(() => {
    loadHiddenCompanies();
  }, []);

  return {
    hiddenCompanies,
    loading,
    unhideCompany,
    updateReason,
    loadHiddenCompanies
  };
}; 