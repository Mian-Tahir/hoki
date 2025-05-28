import { useEffect, useState } from 'react';
import { base } from '../config/airtable';
import type { FieldSet, Record as AirtableRecord } from 'airtable';

interface TableRecord {
  id: string;
  fields: FieldSet;
}

const TABLE_NAME = 'Leads'; // Define the table name as a constant

// Function to get leads count for specific date
export const getLeadsCountToday = async (): Promise<number> => {
  try {
    // Set the specific date we want to filter by
    const targetDate = new Date('2025-05-17T00:00:00.000Z');
    const nextDate = new Date('2025-05-18T00:00:00.000Z');
    
    const records = await base(TABLE_NAME)
      .select({
        filterByFormula: `AND(
          IS_AFTER({Last Modified}, '${targetDate.toISOString()}'),
          IS_BEFORE({Last Modified}, '${nextDate.toISOString()}')
        )`,
        fields: ['Last Modified']
      })
      .all();

    console.log('Filtering records for date:', targetDate.toISOString());
    console.log('Found records:', records.length);
    records.forEach(record => {
      console.log('Record Last Modified:', record.fields['Last Modified']);
    });

    return records.length;
  } catch (err: any) {
    console.error('Error fetching leads count:', err);
    return 0;
  }
};

export function AirtableExample() {
  const [records, setRecords] = useState<TableRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Attempting to fetch from table:', TABLE_NAME);
        console.log('Using API Key:', import.meta.env.VITE_AIRTABLE_API_KEY ? 'Present' : 'Missing');
        console.log('Using Base ID:', import.meta.env.VITE_AIRTABLE_BASE_ID ? 'Present' : 'Missing');

        const records = await base(TABLE_NAME)
          .select({
            maxRecords: 10,
            view: "Grid view"
          })
          .all();

        const formattedRecords: TableRecord[] = records.map(record => ({
          id: record.id,
          fields: record.fields
        }));

        setRecords(formattedRecords);
        console.log('Successfully fetched records:', formattedRecords);
        setLoading(false);
      } catch (err: any) {
        console.error('Detailed error:', err);
        let errorMessage = 'An error occurred while fetching data';
        
        if (err.error === 'NOT_AUTHORIZED') {
          errorMessage = 'Not authorized to access this table. Please check your API key permissions.';
        } else if (err.error === 'NOT_FOUND') {
          errorMessage = `Table "${TABLE_NAME}" not found. Please check the table name.`;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="p-4">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-4">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Airtable Data - {TABLE_NAME}</h2>
      <div className="grid gap-4">
        {records.map((record) => (
          <div key={record.id} className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            {Object.entries(record.fields).map(([key, value]) => (
              <div key={key} className="mb-2">
                <span className="font-semibold">{key}: </span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 