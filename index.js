
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
// El MB360 envía los datos como texto plano, esto le dice a Express que lo acepte
app.use(express.text({ type: '*/*' })); 

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Rutas obligatorias de ZKTeco
app.get('/iclock/cdata', (req, res) => res.status(200).send('OK'));
app.get('/iclock/getrequest', (req, res) => res.status(200).send('OK'));

app.post('/iclock/cdata', async (req, res) => {
  const lines = req.body.split('\n').filter(line => line.trim() !== '');
  
  for (const line of lines) {
    const [emp_id, timestamp, punch_type] = line.split('\t');
    if (emp_id && timestamp) {
        await supabase.from('attendances').insert([{
          emp_id: emp_id.trim(),
          timestamp: timestamp.trim(),
          punch_type: punch_type ? punch_type.trim() : null
        }]);
    }
  }
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor ADMS corriendo en el puerto ${PORT}`));
