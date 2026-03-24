import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xggakuujzrftrxnosigi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZ2FrdXVqenJmdHJ4bm9zaWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NzkzOTgsImV4cCI6MjA4ODU1NTM5OH0.YP7u9OJzLCWXiB6j2XE09R8jbwDcV73n1IANZUzNMpU';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
