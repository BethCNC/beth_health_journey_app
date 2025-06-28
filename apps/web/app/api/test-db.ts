import { NextApiRequest, NextApiResponse } from 'next';
import { conditionsService, symptomsService, providersService } from '../../lib/firebase/services';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test Firebase connection by attempting to fetch data from each collection
    const [conditions, symptoms, providers] = await Promise.allSettled([
      conditionsService.getAll(),
      symptomsService.getAll(), 
      providersService.getAll()
    ]);

    // Check if any of the promises were rejected
    const results = {
      conditions: conditions.status === 'fulfilled' ? conditions.value.slice(0, 5) : null,
      symptoms: symptoms.status === 'fulfilled' ? symptoms.value.slice(0, 5) : null,
      providers: providers.status === 'fulfilled' ? providers.value.slice(0, 5) : null,
    };

    // Determine if there were any errors
    const errors = [];
    if (conditions.status === 'rejected') errors.push(`Conditions: ${conditions.reason}`);
    if (symptoms.status === 'rejected') errors.push(`Symptoms: ${symptoms.reason}`);
    if (providers.status === 'rejected') errors.push(`Providers: ${providers.reason}`);

    if (errors.length > 0) {
      return res.status(500).json({
        success: false,
        message: 'Some Firebase collections failed to connect',
        errors,
        data: results
      });
    }

    // Return success with data
    res.status(200).json({
      success: true,
      message: 'Firebase connection successful',
      data: results
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
} 