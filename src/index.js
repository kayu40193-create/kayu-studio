export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "https://kayu40193-create.github.io",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, {
        status: 405, headers: cors
      });
    }

    try {
      const body = await request.json();
      const message = String(body.message || "").trim();

      if (!message || message.length > 1000) {
        return Response.json({ error: "رسالة غير صالحة" }, {
          status: 400, headers: cors
        });
      }

      const result = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          messages: [
            {
              role: "system",
              content: "أنت Kayu AI، مساعد موقع Kayu Studio. أجب بلغة الزائر وبأسلوب مهذب ومختصر. اشرح خدمات تصميم تطبيقات أندرويد والمواقع والمتاجر الإلكترونية. لا تخترع أسعاراً أو معلومات غير معروفة."
            },
            { role: "user", content: message }
          ]
        }
      );

      return Response.json({
        reply: result.response || "عذراً، لم أتمكن من الإجابة."
      }, { headers: cors });

    } catch (error) {
      return Response.json({ error: "حدث خطأ، حاول مرة أخرى." }, {
        status: 500, headers: cors
      });
    }
  }
};
