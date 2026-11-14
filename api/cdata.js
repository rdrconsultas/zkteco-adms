import { createClient } from '@supabase/supabase-js';

// Se conectará usando las variables que pondremos en Vercel después
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  // El MB360 envía un GET primero para comprobar si el servidor existe
  if (req.method === 'GET') return res.status(200).send('OK');

  // Luego envía los datos de las huellas por POST
  if (req.method === 'POST') {
    const rawData = req.body;
    const lines = rawData.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
      const [emp_id, timestamp, punch_type] = line.split('\t');
      await supabase.from('attendances').insert([{
        emp_id: emp_id.trim(),
        timestamp: timestamp.trim(),
        punch_type: punch_type.trim()
      }]);
    }
    return res.status(200).send('OK');
  }
}
