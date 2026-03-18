import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const buildFullAddress = (addressLine1: string, city: string, state: string, postalCode: string) => {
  const street = addressLine1.trim()
  const locality = city.trim()
  const region = state.trim()
  const zip = postalCode.trim()

  return `${street}, ${locality}, ${region} ${zip}`
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const {
      first_name,
      last_name,
      email,
      phone,
      address,
      address_line_1,
      city,
      state,
      postal_code,
    } = await req.json()

    const fullAddress = String(address || '').trim() || (
      address_line_1 && city && state && postal_code
        ? buildFullAddress(address_line_1, city, state, postal_code)
        : ''
    )

    if (!first_name || !email || !fullAddress) {
      return new Response(
        JSON.stringify({ success: false, error: 'First name, email, street address, city, state, and ZIP code are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { error } = await supabaseClient
      .from('raffle_entries')
      .insert({ first_name, last_name, email, phone, address: fullAddress })

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
