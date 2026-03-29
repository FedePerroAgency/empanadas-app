import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://paaaywnelsfpfdkurvju.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYWF5d25lbHNmcGZka3Vydmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NDEyMjIsImV4cCI6MjA5MDMxNzIyMn0.gds0HFCx0jQ41wvqaYUiZ3REmNY_0z5wnejTrDoe1hs';

export const supabase = createClient(supabaseUrl, supabaseKey);
