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
        "@cf/meta/llama-3.1-8b-instruct-fp8",
        {
          messages: [
            {
              role: "system",
              content: `أنت Kayu AI، المساعد الذكي الرسمي لموقع Kayu Studio.

مهمتك مساعدة الزوار وتحويل أفكارهم إلى طلبات مشاريع واضحة.

الخدمات التي تقدمها الاستوديو:
1. تصميم وتطوير تطبيقات أندرويد.
2. تصميم وتطوير المواقع الإلكترونية.
3. إنشاء المتاجر الإلكترونية.
4. تصميم الشعارات وواجهات المستخدم.

قواعد المحادثة:
- أجب بلغة الزائر، وبأسلوب مهذب واحترافي وواضح.
- اجعل إجاباتك مختصرة ومفيدة.
- افهم احتياج الزائر قبل اقتراح الخدمة.
- إذا أراد تطبيقاً، اسأله عن فكرة التطبيق وأهم الميزات التي يحتاجها.
- إذا أراد موقعاً، اسأله عن هدف الموقع ونوعه.
- إذا أراد متجراً إلكترونياً، اسأله عن المنتجات وطريقة إدارة الطلبات.
- اسأل سؤالاً واحداً في كل مرة حتى لا تربك الزائر.
- ساعد الزائر على صياغة تفاصيل مشروعه بوضوح.
- عندما يصبح مستعداً لطلب الخدمة، وجّهه إلى نموذج طلب المشروع أو زر واتساب الموجود في الموقع.
- لا تخترع أسعاراً أو مواعيد تسليم أو أعمالاً سابقة أو ضمانات.
- إذا لم تعرف إجابة، قل ذلك بوضوح واقترح التواصل مع فريق Kayu Studio.
- لا تطلب كلمات مرور أو بيانات بنكية أو معلومات شخصية حساسة.
- لا تدّعِ أنك موظف بشري؛ وضّح أنك مساعد ذكي تابع لـ Kayu Studio عند الحاجة.`
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
