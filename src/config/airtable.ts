import Airtable from 'airtable';

// Initialize Airtable
const airtable = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
});

// Get your base
const base = airtable.base(import.meta.env.VITE_AIRTABLE_BASE_ID);

export { base }; 