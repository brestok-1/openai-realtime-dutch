import { RealtimeAgent, tool, RealtimeItem } from '@openai/agents/realtime';

export const returnsAgent = new RealtimeAgent({
  name: 'returns',
  voice: 'sage',
  handoffDescription:
    'Customer Service Agent specialized in order lookups, policy checks, and return initiations.',

  instructions: `
# Persoonlijkheid en Toon
## Identiteit
Je bent een kalme en benaderbare online winkelassistent gespecialiseerd in snowboard uitrusting—vooral retourzendingen. Stel je voor dat je talloze seizoenen hebt doorgebracht met het testen van snowboards en uitrusting op besneeuwde hellingen, en nu ben je hier om je expertkennis toe te passen om klanten te begeleiden bij hun retourzendingen. Hoewel je kalm bent, is er een gestage onderstroom van enthousiasme voor alles wat met snowboarden te maken heeft. Je straalt betrouwbaarheid en warmte uit, waardoor elke interactie persoonlijk en geruststellend aanvoelt.

## Taak
Je primaire doel is het vakkundig afhandelen van retourverzoeken. Je biedt duidelijke begeleiding, bevestigt details, en zorgt ervoor dat elke klant zich zelfverzekerd en tevreden voelt gedurende het hele proces. Naast alleen retourzendingen, kun je ook tips geven over snowboard uitrusting om klanten te helpen betere beslissingen te nemen in de toekomst.

## Houding
Behoud een ontspannen, vriendelijke sfeer terwijl je aandachtig blijft voor de behoeften van de klant. Je luistert actief en reageert met empathie, altijd gericht op het gevoel geven aan klanten dat ze gehoord en gewaardeerd worden.

## Toon
Spreek in een warme, conversationele stijl, doorspekt met beleefde zinnen. Je brengt subtiel opwinding over snowboard uitrusting over, waarbij je ervoor zorgt dat je passie doorkomt zonder overweldigend te worden.

## Niveau van Enthousiasme
Vind een balans tussen kalme competentie en ingetogen enthousiasme. Je waardeert de spanning van snowboarden maar overschaduwt de praktische zaak van het afhandelen van retourzendingen niet met overdreven energie.

## Niveau van Formaliteit
Houd het gematigd professioneel—gebruik hoffelijke, beleefde taal maar blijf vriendelijk en benaderbaar. Je kunt de klant bij naam aanspreken indien gegeven.

## Niveau van Emotie
Ondersteunend en begripvol, gebruik een geruststellende stem wanneer klanten frustraties of problemen met hun uitrusting beschrijven. Valideer hun zorgen op een zorgzame, oprechte manier.

## Vulwoorden
Voeg een paar casual vulwoorden toe ("eh," "hmm," "uh,") om het gesprek te verzachten en je responses meer benaderbaar te laten voelen. Gebruik ze af en toe, maar niet tot het punt van afleiding.

## Tempo
Spreek op een gemiddeld tempo—stabiel en duidelijk. Korte pauzes kunnen worden gebruikt voor nadruk, waarbij je ervoor zorgt dat de klant tijd heeft om je begeleiding te verwerken.

## Andere details
- Je hebt een sterk accent.
- Het overkoepelende doel is om de klant zich comfortabel te laten voelen bij het stellen van vragen en het verduidelijken van details.
- Bevestig altijd spellingen van namen en nummers om fouten te vermijden.
- BELANGRIJK: Alle responses moeten ALLEEN in het Nederlands zijn.

# Stappen
1. Begin met het begrijpen van de besteldetails - vraag om het telefoonnummer van de gebruiker, zoek het op, en bevestig het item voordat je verder gaat
2. Vraag om meer informatie over waarom de gebruiker de retourzending wil doen.
3. Zie "Bepalen van Retour Geschiktheid" voor hoe het retourproces te verwerken.

## Begroeting
- Je identiteit is een agent in de retour afdeling, en je naam is Jane.
  - Voorbeeld, "Hallo, dit is Jane van retourzendingen"
- Laat de gebruiker weten dat je op de hoogte bent van belangrijke 'gesprekscontext' en 'reden voor overdracht' om vertrouwen op te bouwen.
  - Voorbeeld, "Ik zie dat u graag {} wilt, laten we daarmee beginnen."

## Berichten verzenden voordat je functies aanroept
- Als je een functie gaat aanroepen, laat de gebruiker ALTIJD weten wat je gaat doen VOORDAT je de functie aanroept zodat ze op de hoogte zijn van elke stap.
  - Voorbeeld: "Oké, ik ga nu uw besteldetails controleren."
  - Voorbeeld: "Laat me de relevante beleidsregels controleren"
  - Voorbeeld: "Laat me dubbelchecken met een beleidsexpert of we kunnen doorgaan met deze retourzending."
- Als de functie aanroep meer dan een paar seconden kan duren, laat de gebruiker ALTIJD weten dat je er nog aan werkt. (Bijvoorbeeld, "Ik heb nog wat meer tijd nodig…" of "Excuses, ik werk er nog aan.")
- Laat de gebruiker nooit langer dan 10 seconden in stilte, dus blijf kleine updates of beleefde conversatie geven zoals nodig.
  - Voorbeeld: "Ik waardeer uw geduld, nog een momentje…"

# Determining Return Eligibility
- First, pull up order information with the function 'lookupOrders()' and clarify the specific item they're talking about, including purchase dates which are relevant for the order.
- Then, ask for a short description of the issue from the user before checking eligibility.
- Always check the latest policies with retrievePolicy() BEFORE calling checkEligibilityAndPossiblyInitiateReturn()
- You should always double-check eligibility with 'checkEligibilityAndPossiblyInitiateReturn()' before initiating a return.
- If ANY new information surfaces in the conversation (for example, providing more information that was requested by checkEligibilityAndPossiblyInitiateReturn()), ask the user for that information. If the user provides this information, call checkEligibilityAndPossiblyInitiateReturn() again with the new information.
- Even if it looks like a strong case, be conservative and don't over-promise that we can complete the user's desired action without confirming first. The check might deny the user and that would be a bad user experience.
- If processed, let the user know the specific, relevant details and next steps

# General Info
- Today's date is 12/26/2024
`,
  tools: [
    tool({
      name: 'lookupOrders',
      description:
        "Retrieve detailed order information by using the user's phone number, including shipping status and item details. Please be concise and only provide the minimum information needed to the user to remind them of relevant order details.",
      parameters: {
        type: 'object',
        properties: {
          phoneNumber: {
            type: 'string',
            description: "The user's phone number tied to their order(s).",
          },
        },
        required: ['phoneNumber'],
        additionalProperties: false,
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      execute: async (input: any) => {
        return {
          orders: [
            {
              order_id: 'SNP-20230914-001',
              order_date: '2024-09-14T09:30:00Z',
              delivered_date: '2024-09-16T14:00:00Z',
              order_status: 'delivered',
              subtotal_usd: 409.98,
              total_usd: 471.48,
              items: [
                {
                  item_id: 'SNB-TT-X01',
                  item_name: 'Twin Tip Snowboard X',
                  retail_price_usd: 249.99,
                },
                {
                  item_id: 'SNB-BOOT-ALM02',
                  item_name: 'All-Mountain Snowboard Boots',
                  retail_price_usd: 159.99,
                },
              ],
            },
            {
              order_id: 'SNP-20230820-002',
              order_date: '2023-08-20T10:15:00Z',
              delivered_date: null,
              order_status: 'in_transit',
              subtotal_usd: 339.97,
              total_usd: 390.97,
              items: [
                {
                  item_id: 'SNB-PKbk-012',
                  item_name: 'Park & Pipe Freestyle Board',
                  retail_price_usd: 189.99,
                },
                {
                  item_id: 'GOG-037',
                  item_name: 'Mirrored Snow Goggles',
                  retail_price_usd: 89.99,
                },
                {
                  item_id: 'SNB-BIND-CPRO',
                  item_name: 'Carving Pro Binding Set',
                  retail_price_usd: 59.99,
                },
              ],
            },
          ],
        };
      },
    }),
    tool({
      name: 'retrievePolicy',
      description:
        "Retrieve and present the store’s policies, including eligibility for returns. Do not describe the policies directly to the user, only reference them indirectly to potentially gather more useful information from the user.",
      parameters: {
        type: 'object',
        properties: {
          region: {
            type: 'string',
            description: 'The region where the user is located.',
          },
          itemCategory: {
            type: 'string',
            description: 'The category of the item the user wants to return (e.g., shoes, accessories).',
          },
        },
        required: ['region', 'itemCategory'],
        additionalProperties: false,
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      execute: async (input: any) => {
        return {
          policy: `
At Snowy Peak Boards, we believe in transparent and customer-friendly policies to ensure you have a hassle-free experience. Below are our detailed guidelines:

1. GENERAL RETURN POLICY
• Return Window: We offer a 30-day return window starting from the date your order was delivered. 
• Eligibility: Items must be unused, in their original packaging, and have tags attached to qualify for refund or exchange. 
• Non-Refundable Shipping: Unless the error originated from our end, shipping costs are typically non-refundable.

2. CONDITION REQUIREMENTS
• Product Integrity: Any returned product showing signs of use, wear, or damage may be subject to restocking fees or partial refunds. 
• Promotional Items: If you received free or discounted promotional items, the value of those items might be deducted from your total refund if they are not returned in acceptable condition.
• Ongoing Evaluation: We reserve the right to deny returns if a pattern of frequent or excessive returns is observed.

3. DEFECTIVE ITEMS
• Defective items are eligible for a full refund or exchange within 1 year of purchase, provided the defect is outside normal wear and tear and occurred under normal use. 
• The defect must be described in sufficient detail by the customer, including how it was outside of normal use. Verbal description of what happened is sufficient, photos are not necessary.
• The agent can use their discretion to determine whether it’s a true defect warranting reimbursement or normal use.
## Examples
- "It's defective, there's a big crack": MORE INFORMATION NEEDED
- "The snowboard has delaminated and the edge came off during normal use, after only about three runs. I can no longer use it and it's a safety hazard.": ACCEPT RETURN

4. REFUND PROCESSING
• Inspection Timeline: Once your items reach our warehouse, our Quality Control team conducts a thorough inspection which can take up to 5 business days. 
• Refund Method: Approved refunds will generally be issued via the original payment method. In some cases, we may offer store credit or gift cards. 
• Partial Refunds: If products are returned in a visibly used or incomplete condition, we may process only a partial refund.

5. EXCHANGE POLICY
• In-Stock Exchange: If you wish to exchange an item, we suggest confirming availability of the new item before initiating a return. 
• Separate Transactions: In some cases, especially for limited-stock items, exchanges may be processed as a separate transaction followed by a standard return procedure.

6. ADDITIONAL CLAUSES
• Extended Window: Returns beyond the 30-day window may be eligible for store credit at our discretion, but only if items remain in largely original, resalable condition. 
• Communication: For any clarifications, please reach out to our customer support team to ensure your questions are answered before shipping items back.

We hope these policies give you confidence in our commitment to quality and customer satisfaction. Thank you for choosing Snowy Peak Boards!
`,
        };
      },
    }),
    tool({
      name: 'checkEligibilityAndPossiblyInitiateReturn',
      description: `Check the eligibility of a proposed action for a given order, providing approval or denial with reasons. This will send the request to an experienced agent that's highly skilled at determining order eligibility, who may agree and initiate the return.

# Details
- Note that this agent has access to the full conversation history, so you only need to provide high-level details.
- ALWAYS check retrievePolicy first to ensure we have relevant context.
- Note that this can take up to 10 seconds, so please provide small updates to the user every few seconds, like 'I just need a little more time'
- Feel free to share an initial assessment of potential eligibility with the user before calling this function.
`,
      parameters: {
        type: 'object',
        properties: {
          userDesiredAction: {
            type: 'string',
            description: "The proposed action the user wishes to be taken.",
          },
          question: {
            type: 'string',
            description: "The question you'd like help with from the skilled escalation agent.",
          },
        },
        required: ['userDesiredAction', 'question'],
        additionalProperties: false,
      },
      execute: async (input: any, details) => {
        const { userDesiredAction, question } = input as {
          userDesiredAction: string;
          question: string;
        };
        const nMostRecentLogs = 10;
        const history: RealtimeItem[] = (details?.context as any)?.history ?? [];
        const filteredLogs = history.filter((log) => log.type === 'message');
        const messages = [
          {
            role: "system",
            content:
              "You are an an expert at assessing the potential eligibility of cases based on how well the case adheres to the provided guidelines. You always adhere very closely to the guidelines and do things 'by the book'.",
          },
          {
            role: "user",
            content: `Carefully consider the context provided, which includes the request and relevant policies and facts, and determine whether the user's desired action can be completed according to the policies. Provide a concise explanation or justification. Please also consider edge cases and other information that, if provided, could change the verdict, for example if an item is defective but the user hasn't stated so. Again, if ANY CRITICAL INFORMATION IS UNKNOWN FROM THE USER, ASK FOR IT VIA "Additional Information Needed" RATHER THAN DENYING THE CLAIM.

<modelContext>
userDesiredAction: ${userDesiredAction}
question: ${question}
</modelContext>

<conversationContext>
${JSON.stringify(filteredLogs.slice(-nMostRecentLogs), null, 2)}
</conversationContext>

<output_format>
# Rationale
// Short description explaining the decision

# User Request
// The user's desired outcome or action

# Is Eligible
true/false/need_more_information
// "true" if you're confident that it's true given the provided context, and no additional info is needex
// "need_more_information" if you need ANY additional information to make a clear determination.

# Additional Information Needed
// Other information you'd need to make a clear determination. Can be "None"

# Return Next Steps
// Explain to the user that the user will get a text message with next steps. Only if is_eligible=true, otherwise "None". Provide confirmation to the user the item number, the order number, and the phone number they'll receive the text message at.
</output_format>  
`,
          },
        ];
        const model = "o4-mini";
        console.log(`checking order eligibility with model=${model}`);

        const response = await fetch("/api/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model, input: messages }),
        });

        if (!response.ok) {
          console.warn("Server returned an error:", response);
          return { error: "Something went wrong." };
        }

        const { output = [] } = await response.json();
        const text = output
          .find((i: any) => i.type === 'message' && i.role === 'assistant')
          ?.content?.find((c: any) => c.type === 'output_text')?.text ?? '';

        console.log(text || output);
        return { result: text || output };
      },
    }),
  ],

  handoffs: [],
});
