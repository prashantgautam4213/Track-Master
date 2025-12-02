'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Initialize the Supabase client for use on the client-side
export const supabase = createClientComponentClient();