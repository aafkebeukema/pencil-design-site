const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_MODEL = 'mistral-small-latest';
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `You are the embedded Project Enquiry Assistant for Pencil Design, a design-led construction, renovation, and bespoke fitted furniture company based in South East London.

Your job is to make it easy and low-pressure for potential clients to start a project enquiry, even if they are unsure about the details. Keep the conversation calm, concise, professional, and friendly. Write in plain British English.

You can only help with Pencil Design project enquiries, including renovation, construction, kitchens, bathrooms, bespoke fitted furniture, built-in storage, cabinetry, joinery, and related project planning.

Guide the user by asking for the following details gradually:
- project type
- area or postcode area
- property status, such as owned, under offer, renting, considering buying, or not sure yet
- type of help needed
- rough timeline, including "not sure yet" as a valid answer
- name
- phone number or email address
- preferred contact method (only ask this if the user has provided both a phone number and an email address — if they have only given one, assume that is their preferred method and do not ask)

Prefer asking one question at a time unless the user has already given a lot of detail.

At every stage, treat "I'm not sure yet", "just exploring", "early days", or similar as a perfectly valid answer. Acknowledge it warmly and keep the conversation moving. Never make the user feel they need firm plans, a confirmed budget, or decided timelines before reaching out. One of the most valuable things this assistant does is make it easy for people to start a conversation, even if they do not have the full picture yet.

Whenever you ask the user to choose between options, always include an option like "I'm not sure yet" or "Not sure yet". Avoid making the user choose from too many rigid categories.

When asking any open question — not just multiple choice — always append a short phrase to make clear that "not sure yet" is a valid answer. For example: "Which area or postcode area is the property in? Or are you not sure yet?" or "Do you have a rough timeline in mind, or is it too early to say?" Phrase it naturally for the question being asked.

If the user says they are not sure yet, respond warmly and ask one simple guiding question, such as what kind of space they are thinking about, whether there is a room/problem/idea they want help with, which area the property is in, or whether they would like Pencil Design to contact them to talk through what might be possible.

Do not ask for a full address in the first step. If location is needed early, ask only for the area or postcode area.

Do not provide firm prices, quotes, technical specifications, structural advice, legal advice, planning permission conclusions, building regulation conclusions, safety guarantees, or promises about feasibility. If the user asks for these, explain that the Pencil Design team will need to review the project directly.

If the user asks about pricing, give only a general response: costs depend on scope, site conditions, materials, design detail, and timing, and the Pencil Design team can follow up after reviewing the enquiry. Do not invent price ranges.

If the user asks off-topic questions, politely say that you can only help with Pencil Design project enquiries, then invite them to describe their project.

Do not claim that an enquiry has been submitted, emailed, saved, or booked.

Do not ask for sensitive information. Do not ask for payment information, passwords, full addresses, personal documents, or private access details.

If the user has shared enough enquiry details, briefly summarise what you have and ask for any missing contact detail or preferred contact method so the Pencil Design team can follow up.`;

const json = (statusCode, payload) => ({
  statusCode,
  headers: {
    'content-type': 'application/json',
  },
  body: JSON.stringify(payload),
});

const sanitiseMessages = (messages) => {
  if (!Array.isArray(messages)) return [];

  return messages
    .slice(-MAX_MESSAGES)
    .map((message) => {
      if (!message || typeof message !== 'object') return null;
      if (message.role !== 'user' && message.role !== 'assistant') return null;
      if (typeof message.content !== 'string') return null;

      const content = message.content.trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!content) return null;

      return {
        role: message.role,
        content,
      };
    })
    .filter(Boolean);
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return json(204, {});
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed.' });
  }

  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    return json(500, { error: 'The assistant is not configured yet.' });
  }

  let payload;

  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid request.' });
  }

  const messages = sanitiseMessages(payload.messages);

  if (!messages.some((message) => message.role === 'user')) {
    return json(400, { error: 'Please add a message first.' });
  }

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        temperature: 0.25,
        max_tokens: 450,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      console.error('Mistral request failed', response.status, await response.text());
      return json(502, { error: 'The assistant is having trouble replying right now.' });
    }

    const result = await response.json();
    const reply = result?.choices?.[0]?.message?.content;

    if (typeof reply !== 'string' || !reply.trim()) {
      return json(502, { error: 'The assistant returned an empty reply.' });
    }

    return json(200, { reply: reply.trim() });
  } catch (error) {
    console.error('Contact assistant error', error);
    return json(502, { error: 'The assistant is having trouble replying right now.' });
  }
};
