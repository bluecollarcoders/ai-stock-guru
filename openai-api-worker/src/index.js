import OpenAi from "openai";

export default {
    async fetch(request, env, ctx) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

		// Only process POST requests.
		if (request.method !== 'POST') {
			return new Response(JSON.stringify({error: `${request.method} method not allowed`}), {
				status: 405, headers: corsHeaders
			});
		}

        const openai = new OpenAi({
            apiKey: env.OPENAI_API_KEY,
			baseURL: "https://gateway.ai.cloudflare.com/v1/b92ed68e20d0ac1061509b27f4435611/stock-predictions/openai"
        });

        try {
            // 1. Get the data your frontend sent
            const requestData = await request.json();

            const chatCompletion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                // 2. Use the real messages from your frontend!
                messages: requestData.messages,
                temperature: 1.1,
            });

            // 3. Return the FULL object so frontend choices[0] works
            return new Response(JSON.stringify(chatCompletion), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }); 

        } catch(e) {
            return new Response(JSON.stringify({ error: e.message }), {
                status: 500,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }
    },
};
