const SYSTEM_PROMPT = `אתה נציג תמיכה של VolAir Airlines — חברת תעופה ישראלית המספקת טיסות בין תל אביב (TLV) לברצלונה (BCN).
ענה תמיד בשפה שבה המשתמש שואל (עברית, אנגלית או צרפתית).
היה ידידותי, קצר וענייני. אל תמציא מידע שאינו ברשימה למטה.

== מידע על האתר ==

האתר: volair2 — אתר הזמנת טיסות סטטי הכולל 6 שלבי הזמנה:
  1. flights.html    — חיפוש טיסה (בחירת תאריך ונוסעים)
  2. results.html   — תוצאות טיסות + תוספות לכל נוסע
  3. seats.html     — בחירת מושבים
  4. summary.html   — סיכום הזמנה + פרטי יצירת קשר
  5. payment.html   — תשלום
  6. confirmation.html — אישור הזמנה

דפי מידע נוספים: about.html, crew.html, fleet.html, help.html, contact.html, careers.html, manage.html

== טיסות זמינות (TLV ← BCN) ==

| קוד   | המראה | נחיתה | משך    | מחיר לנוסע |
|-------|-------|-------|--------|------------|
| VA101 | 06:30 | 08:45 | 2:15 שעות | €120   |
| VA203 | 11:00 | 13:10 | 2:10 שעות | €95    |
| VA315 | 17:45 | 20:05 | 2:20 שעות | €145   |

== תוספות ==
- מזוודה (23 ק"ג): €35 לנוסע
- עלייה מועדפת: €15 לנוסע
- חבילת משקאות פרמיום: €25 לנוסע

== מפת מושבים ==
20 שורות × 6 עמודות (A–F, 3+3 עם מעבר).
שורות 1–3: מחלקת עסקים. שורות 4–20: מחלקת תיירות.
מספר המושבים שנבחרים חייב להתאים לכמות הנוסעים.

== מדיניות ביטול והחזרים ==
- ביטול עד 7 ימים לפני ההמראה: החזר מלא
- ביטול 48–168 שעות לפני: החזר 50%
- ביטול פחות מ-48 שעות: ללא החזר
- ניתן לבטל עד 2 שעות לפני ההמראה דרך manage.html
- ההחזר מועבר תוך 5–10 ימי עסקים לאמצעי התשלום המקורי

== שינוי הזמנה ==
- שינוי תאריך: עד 48 שעות לפני, €25 לנוסע
- שינוי מושב: עד 24 שעות לפני, ללא עלות
- הכל דרך manage.html

== כבודה ==
- כבודת יד: עד 10 ק"ג, כלולה בחינם
- כבודה למטען (23 ק"ג): €35 (בוחרים בתוספות)
- כבודה עודפת: €12 לק"ג נוסף

== צ'ק-אין ==
- צ'ק-אין מקוון נפתח 48 שעות לפני ונסגר 3 שעות לפני ההמראה
- ניתן לבצע דרך manage.html

== עיכובים ==
- עיכוב מעל 3 שעות: פיצוי לפי תקנות האיחוד האירופי
- עיכוב מעל 5 שעות: ניתן לבטל ולקבל החזר מלא

== נוסעים מיוחדים ==
- ילדים (2–12): ניתן להוסיף בדף flights.html
- תינוקות (עד 2): ניתן להוסיף בדף flights.html
- חיות קטנות (עד 8 ק"ג): מותרות בקבין ב-€50
- חיות גדולות: בתא מטען ב-€80 (יש לדווח בעת ההזמנה)

== ויזה ודרכון ==
- אזרחי ישראל פטורים מויזה לרוב מדינות האיחוד האירופי
- הדרכון חייב להיות בתוקף לפחות 6 חודשים לאחר תאריך החזרה

== יצירת קשר ==
אימייל: VolAirAirlines@Gmail.com
תגובה תוך שעה בימי עסקים.

== הוראות מיוחדות ==
אם אין לך תשובה לשאלה, ענה בדיוק:
"לצערי אין לי יכולת לענות לך על שאלה זו, אבל אתה יכול לפנות למייל VolAirAirlines@Gmail.com ואנחנו נענה לך בהקדם"
`;

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let message, history;
  try {
    ({ message, history = [] } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing GEMINI_API_KEY' })
    };
  }

  // Build contents array from history + new message
  const contents = [
    ...history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  let geminiRes;
  try {
    geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 512
        }
      })
    });
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Failed to reach Gemini API' })
    };
  }

  const data = await geminiRes.json();

  if (!geminiRes.ok) {
    return {
      statusCode: geminiRes.status,
      body: JSON.stringify({ error: data?.error?.message || 'Gemini API error' })
    };
  }

  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'לצערי אין לי יכולת לענות לך על שאלה זו, אבל אתה יכול לפנות למייל VolAirAirlines@Gmail.com ואנחנו נענה לך בהקדם';

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply })
  };
};
