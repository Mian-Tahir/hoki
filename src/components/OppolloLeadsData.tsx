import { useEffect, useState } from 'react';
import { base } from '../config/airtable';
import type { FieldSet, Record as AirtableRecord } from 'airtable';

export interface OppolloLead {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  email: string;
  source: string;
  companyNameForEmails: string;
  emailStatus: string;
  primaryEmailSource: string;
  primaryEmailCatchallStatus: string;
  primaryEmailLastVerifiedAt: string;
  seniority: string;
  departments: string;
  contactOwner: string;
  corporatePhone: string;
  stage: string;
  accountOwner: string;
  employeeCount: number;
  industry: string;
  keywords: string;
  personLinkedinUrl: string;
  website: string;
  companyLinkedinUrl: string;
  city: string;
  state: string;
  country: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyCountry: string;
  companyPhone: string;
  seoDescription: string;
  technologies: string;
  emailOpen: string;
  emailBounced: string;
  replied: string;
  demoed: string;
  apolloContactId: string;
  apolloAccountId: string;
}

interface OppolloLeadsDataProps {
  onLeadsLoaded: (leads: OppolloLead[]) => void;
  onError: (error: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

const TABLE_NAME = 'apollo 2';

export const fetchOppolloLeads = async (): Promise<OppolloLead[]> => {
  try {
    const records = await base(TABLE_NAME)
      .select({
        fields: [
          'First Name', 'Last Name', 'Company', 'Title', 'Email', 'Status', 'Source',
          'Company Name for Emails', 'Email Status', 'Primary Email Source',
          'Primary Email Catch-all Status', 'Primary Email Last Verified At',
          'Seniority', 'Departments', 'Contact Owner', 'Corporate Phone',
          'Stage', 'Account Owner', '# Employees', 'Industry', 'Keywords',
          'Person Linkedin Url', 'Website', 'Company Linkedin Url',
          'City', 'State', 'Country', 'Company Address', 'Company City',
          'Company State', 'Company Country', 'Company Phone',
          'SEO Description', 'Technologies', 'Email Open', 'Email Bounced',
          'Replied', 'Demoed', 'Apollo Contact Id', 'Apollo Account Id'
        ],
        view: 'Grid view'
      })
      .all();

    return records.map(record => ({
      id: record.id,
      firstName: String(record.fields['First Name'] || ''),
      lastName: String(record.fields['Last Name'] || ''),
      company: String(record.fields['Company'] || ''),
      title: String(record.fields['Title'] || ''),
      email: String(record.fields['Email'] || ''),
      source: String(record.fields['Source'] || ''),
      companyNameForEmails: String(record.fields['Company Name for Emails'] || ''),
      emailStatus: String(record.fields['Email Status'] || ''),
      primaryEmailSource: String(record.fields['Primary Email Source'] || ''),
      primaryEmailCatchallStatus: String(record.fields['Primary Email Catch-all Status'] || ''),
      primaryEmailLastVerifiedAt: String(record.fields['Primary Email Last Verified At'] || ''),
      seniority: String(record.fields['Seniority'] || ''),
      departments: String(record.fields['Departments'] || ''),
      contactOwner: String(record.fields['Contact Owner'] || ''),
      corporatePhone: String(record.fields['Corporate Phone'] || ''),
      stage: String(record.fields['Stage'] || ''),
      accountOwner: String(record.fields['Account Owner'] || ''),
      employeeCount: Number(record.fields['# Employees'] || 0),
      industry: String(record.fields['Industry'] || ''),
      keywords: String(record.fields['Keywords'] || ''),
      personLinkedinUrl: String(record.fields['Person Linkedin Url'] || ''),
      website: String(record.fields['Website'] || ''),
      companyLinkedinUrl: String(record.fields['Company Linkedin Url'] || ''),
      city: String(record.fields['City'] || ''),
      state: String(record.fields['State'] || ''),
      country: String(record.fields['Country'] || ''),
      companyAddress: String(record.fields['Company Address'] || ''),
      companyCity: String(record.fields['Company City'] || ''),
      companyState: String(record.fields['Company State'] || ''),
      companyCountry: String(record.fields['Company Country'] || ''),
      companyPhone: String(record.fields['Company Phone'] || ''),
      seoDescription: String(record.fields['SEO Description'] || ''),
      technologies: String(record.fields['Technologies'] || ''),
      emailOpen: String(record.fields['Email Open'] || ''),
      emailBounced: String(record.fields['Email Bounced'] || ''),
      replied: String(record.fields['Replied'] || ''),
      demoed: String(record.fields['Demoed'] || ''),
      apolloContactId: String(record.fields['Apollo Contact Id'] || ''),
      apolloAccountId: String(record.fields['Apollo Account Id'] || '')
    }));
  } catch (err: any) {
    console.error('Error fetching oppollo leads:', err);
    let errorMessage = 'An error occurred while fetching leads';
    
    if (err.error === 'NOT_AUTHORIZED') {
      errorMessage = 'Not authorized to access the oppollo table. Please check your API key permissions.';
    } else if (err.error === 'NOT_FOUND') {
      errorMessage = `Table "${TABLE_NAME}" not found. Please check the table name.`;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const OppolloLeadsData: React.FC<OppolloLeadsDataProps> = ({
  onLeadsLoaded,
  onError,
  onLoadingChange
}) => {
  useEffect(() => {
    const loadLeads = async () => {
      try {
        onLoadingChange(true);
        console.log('Fetching data from oppollo table...');
        
        const leads = await fetchOppolloLeads();
        onLeadsLoaded(leads);
        onError(null);
      } catch (err: any) {
        console.error('Error in OppolloLeadsData:', err);
        onError(err.message || 'Failed to fetch leads');
      } finally {
        onLoadingChange(false);
      }
    };

    loadLeads();
  }, [onLeadsLoaded, onError, onLoadingChange]);

  // This component doesn't render anything, it just handles data fetching
  return null;
};

export default OppolloLeadsData; 