import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const donation = await req.json()

    const apiKey = Deno.env.get('DONORFUSE_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, Error: 'Server misconfiguration: missing API key.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const dfResponse = await fetch(
      'https://api.donorfuse.com/api/Integrations/Donations/process',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-api-key': apiKey,
        },
        body: JSON.stringify(donation),
      }
    )

    const result = await dfResponse.json()

    return new Response(
      JSON.stringify(result),
      {
        status: dfResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, Error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
