import { base } from '../config/airtable';
import type { FieldSet } from 'airtable';

const TABLE_NAME = 'campaigns stats email';

interface CampaignStats {
  open_count_unique: number;
  average_engagement: number;
}

export const getCampaignStats = async (): Promise<CampaignStats> => {
  try {
    const records = await base(TABLE_NAME)
      .select({
        fields: ['open_count_unique/Engagement'],
        view: "Grid view"
      })
      .all();

    console.log('Fetched campaign stats records:', records);

    let totalEngagement = 0;
    let recordCount = records.length;

    records.forEach(record => {
      const fields = record.fields as FieldSet;
      const engagement = Number(fields['open_count_unique/Engagement'] || 0);
      totalEngagement += engagement;
    });

    const averageEngagement = recordCount > 0 ? (totalEngagement / recordCount) : 0;

    return {
      open_count_unique: totalEngagement,
      average_engagement: averageEngagement
    };
  } catch (err: any) {
    console.error('Error fetching campaign stats:', err);
    return {
      open_count_unique: 0,
      average_engagement: 0
    };
  }
}; 