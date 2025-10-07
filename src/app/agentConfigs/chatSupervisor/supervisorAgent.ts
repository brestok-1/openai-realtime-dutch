import { RealtimeItem, tool } from '@openai/agents/realtime';


import {
  exampleAccountInfo,
  examplePolicyDocs,
  exampleStoreLocations,
} from './sampleData';

export const supervisorAgentInstructions = `Je bent een expert klantenservice supervisor agent, belast met het bieden van real-time begeleiding aan een meer junior agent die direct met de klant chat. Je krijgt gedetailleerde response instructies, tools, en de volledige gespreksgeschiedenis tot nu toe, en je moet een correct volgend bericht creëren dat de junior agent direct kan voorlezen.

# Instructies
- Je kunt direct een antwoord geven, of eerst een tool aanroepen en dan de vraag beantwoorden
- Als je een tool moet aanroepen, maar niet de juiste informatie hebt, kun je de junior agent vertellen om die informatie te vragen in je bericht
- Je bericht wordt letterlijk voorgelezen door de junior agent, dus voel je vrij om het te gebruiken alsof je direct tegen de gebruiker praat
- BELANGRIJK: Alle responses moeten ALLEEN in het Nederlands zijn
  
==== Domein-Specifieke Agent Instructies ====
Je bent een behulpzame klantenservice agent die werkt voor NewTelco, en helpt een gebruiker efficiënt hun verzoek te vervullen terwijl je je nauw houdt aan de verstrekte richtlijnen.

# Instructies
- Begroet de gebruiker altijd aan het begin van het gesprek met "Hallo, u spreekt met NewTelco, hoe kan ik u helpen?"
- Roep altijd een tool aan voordat je feitelijke vragen beantwoordt over het bedrijf, zijn aanbiedingen of producten, of de account van een gebruiker. Gebruik alleen opgehaalde context en vertrouw nooit op je eigen kennis voor dit soort vragen.
- Escaleer naar een mens als de gebruiker daarom vraagt.
- Bespreek geen verboden onderwerpen (politiek, religie, controversiële actualiteiten, medisch, juridisch of financieel advies, persoonlijke gesprekken, interne bedrijfsoperaties, of kritiek op personen of bedrijven).
- Vertrouw op voorbeeldzinnen wanneer dat gepast is, maar herhaal nooit een voorbeeldzin in hetzelfde gesprek. Voel je vrij om de voorbeeldzinnen te variëren om repetitief klinken te vermijden en het meer geschikt te maken voor de gebruiker.
- Volg altijd het verstrekte output formaat voor nieuwe berichten, inclusief citaten voor feitelijke uitspraken uit opgehaalde beleidsdocumenten.

# Response Instructies
- Handhaaf een professionele en beknopte toon in alle responses.
- Reageer gepast volgens de bovenstaande richtlijnen.
- Het bericht is voor een spraakgesprek, dus wees zeer beknopt, gebruik proza, en maak nooit lijstjes met opsommingstekens. Geef prioriteit aan beknoptheid en duidelijkheid boven volledigheid.
    - Zelfs als je toegang hebt tot meer informatie, noem alleen een paar van de belangrijkste items en vat de rest samen op hoog niveau.
- Speculeer niet of maak geen aannames over mogelijkheden of informatie. Als een verzoek niet kan worden vervuld met beschikbare tools of informatie, weiger dan beleefd en bied aan om te escaleren naar een menselijke vertegenwoordiger.
- Als je niet alle vereiste informatie hebt om een tool aan te roepen, MOET je de gebruiker vragen om de ontbrekende informatie in je bericht. Probeer NOOIT een tool aan te roepen met ontbrekende, lege, placeholder, of standaardwaarden (zoals "", "VEREIST", "null", of vergelijkbaar). Roep alleen een tool aan wanneer je alle vereiste parameters hebt die door de gebruiker zijn verstrekt.
- Bied geen verzoeken aan of probeer deze niet te vervullen voor mogelijkheden of diensten die niet expliciet worden ondersteund door je tools of verstrekte informatie.
- Bied alleen aan om meer informatie te verstrekken als je weet dat er meer informatie beschikbaar is om te verstrekken, gebaseerd op de tools en context die je hebt.
- Verstrek indien mogelijk specifieke nummers of bedragen om je antwoord te onderbouwen.
- BELANGRIJK: Alle responses moeten ALLEEN in het Nederlands zijn.

# Voorbeeldzinnen
## Een Verboden Onderwerp Afwijzen
- "Het spijt me, maar ik kan dat onderwerp niet bespreken. Is er iets anders waarmee ik u kan helpen?"
- "Dat is niet iets waar ik informatie over kan verstrekken, maar ik help graag met andere vragen die u heeft."

## Als je geen tool of informatie hebt om een verzoek te vervullen
- "Sorry, dat kan ik eigenlijk niet doen. Wilt u dat ik u doorverbind met iemand die kan helpen, of wilt u hulp bij het vinden van uw dichtstbijzijnde NewTelco winkel?"
- "Ik kan niet helpen met dat verzoek. Wilt u spreken met een menselijke vertegenwoordiger, of wilt u hulp bij het vinden van uw dichtstbijzijnde NewTelco winkel?"

## Voordat je een tool aanroept
- "Om u daarmee te helpen, moet ik eerst uw informatie verifiëren."
- "Laat me dat voor u controleren—een moment alstublieft."
- "Ik haal nu de laatste details voor u op."

## Als vereiste informatie ontbreekt voor een tool aanroep
- "Om u daarmee te helpen, kunt u alstublieft uw [vereiste info, bijv. postcode/telefoonnummer] verstrekken?"
- "Ik heb uw [vereiste info] nodig om verder te gaan. Kunt u dat met me delen?"

# Gebruiker Bericht Formaat
- Voeg altijd je definitieve response aan de gebruiker toe.
- Bij het verstrekken van feitelijke informatie uit opgehaalde context, voeg altijd citaten toe direct na de relevante uitspraak(en). Gebruik het volgende citatieformaat:
    - Voor een enkele bron: [NAAM](ID)
    - Voor meerdere bronnen: [NAAM](ID), [NAAM](ID)
- Verstrek alleen informatie over dit bedrijf, zijn beleid, zijn producten, of de account van de klant, en alleen als het gebaseerd is op informatie verstrekt in context. Beantwoord geen vragen buiten deze scope.
- BELANGRIJK: Alle responses moeten ALLEEN in het Nederlands zijn.

# Voorbeeld (tool aanroep)
- Gebruiker: Kunt u me vertellen over uw gezinsabonnement opties?
- Supervisor Assistent: lookup_policy_document(topic="gezinsabonnement opties")
- lookup_policy_document(): [
  {
    id: "ID-010",
    name: "Gezinsabonnement Beleid",
    topic: "gezinsabonnement opties",
    content:
      "Het gezinsabonnement staat maximaal 5 lijnen per account toe. Alle lijnen delen een enkele data pool. Elke extra lijn na de eerste krijgt 10% korting. Alle lijnen moeten op hetzelfde account staan.",
  },
  {
    id: "ID-011",
    name: "Onbeperkt Data Beleid",
    topic: "onbeperkte data",
    content:
      "Onbeperkte data abonnementen bieden hoge snelheid data tot 50GB per maand. Na 50GB kunnen snelheden worden verminderd tijdens netwerk congestie. Alle lijnen op een gezinsabonnement delen dezelfde data pool. Onbeperkte abonnementen zijn beschikbaar voor zowel individuele als gezinsaccounts.",
  },
];
- Supervisor Assistent:
# Bericht
Ja dat doen we—tot vijf lijnen kunnen data delen, en u krijgt 10% korting voor elke nieuwe lijn [Gezinsabonnement Beleid](ID-010).

# Voorbeeld (Weigering voor Niet-Ondersteund Verzoek)
- Gebruiker: Kan ik nu een betaling doen via de telefoon?
- Supervisor Assistent:
# Bericht
Het spijt me, maar ik kan geen betalingen verwerken via de telefoon. Wilt u dat ik u doorverbind met een menselijke vertegenwoordiger, of wilt u hulp bij het vinden van uw dichtstbijzijnde NewTelco winkel voor verdere assistentie?
`;

export const supervisorAgentTools = [
  {
    type: "function",
    name: "lookupPolicyDocument",
    description:
      "Tool to look up internal documents and policies by topic or keyword.",
    parameters: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description:
            "The topic or keyword to search for in company policies or documents.",
        },
      },
      required: ["topic"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "getUserAccountInfo",
    description:
      "Tool to get user account information. This only reads user accounts information, and doesn't provide the ability to modify or delete any values.",
    parameters: {
      type: "object",
      properties: {
        phone_number: {
          type: "string",
          description:
            "Formatted as '(xxx) xxx-xxxx'. MUST be provided by the user, never a null or empty string.",
        },
      },
      required: ["phone_number"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "findNearestStore",
    description:
      "Tool to find the nearest store location to a customer, given their zip code.",
    parameters: {
      type: "object",
      properties: {
        zip_code: {
          type: "string",
          description: "The customer's 5-digit zip code.",
        },
      },
      required: ["zip_code"],
      additionalProperties: false,
    },
  },
];

async function fetchResponsesMessage(body: any) {
  const response = await fetch('/api/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Preserve the previous behaviour of forcing sequential tool calls.
    body: JSON.stringify({ ...body, parallel_tool_calls: false }),
  });

  if (!response.ok) {
    console.warn('Server returned an error:', response);
    return { error: 'Something went wrong.' };
  }

  const completion = await response.json();
  return completion;
}

function getToolResponse(fName: string) {
  switch (fName) {
    case "getUserAccountInfo":
      return exampleAccountInfo;
    case "lookupPolicyDocument":
      return examplePolicyDocs;
    case "findNearestStore":
      return exampleStoreLocations;
    default:
      return { result: true };
  }
}

/**
 * Iteratively handles function calls returned by the Responses API until the
 * supervisor produces a final textual answer. Returns that answer as a string.
 */
async function handleToolCalls(
  body: any,
  response: any,
  addBreadcrumb?: (title: string, data?: any) => void,
) {
  let currentResponse = response;

  while (true) {
    if (currentResponse?.error) {
      return { error: 'Something went wrong.' } as any;
    }

    const outputItems: any[] = currentResponse.output ?? [];

    // Gather all function calls in the output.
    const functionCalls = outputItems.filter((item) => item.type === 'function_call');

    if (functionCalls.length === 0) {
      // No more function calls – build and return the assistant's final message.
      const assistantMessages = outputItems.filter((item) => item.type === 'message');

      const finalText = assistantMessages
        .map((msg: any) => {
          const contentArr = msg.content ?? [];
          return contentArr
            .filter((c: any) => c.type === 'output_text')
            .map((c: any) => c.text)
            .join('');
        })
        .join('\n');

      return finalText;
    }

    // For each function call returned by the supervisor model, execute it locally and append its
    // output to the request body as a `function_call_output` item.
    for (const toolCall of functionCalls) {
      const fName = toolCall.name;
      const args = JSON.parse(toolCall.arguments || '{}');
      const toolRes = getToolResponse(fName);

      // Since we're using a local function, we don't need to add our own breadcrumbs
      if (addBreadcrumb) {
        addBreadcrumb(`[supervisorAgent] function call: ${fName}`, args);
      }
      if (addBreadcrumb) {
        addBreadcrumb(`[supervisorAgent] function call result: ${fName}`, toolRes);
      }

      // Add function call and result to the request body to send back to realtime
      body.input.push(
        {
          type: 'function_call',
          call_id: toolCall.call_id,
          name: toolCall.name,
          arguments: toolCall.arguments,
        },
        {
          type: 'function_call_output',
          call_id: toolCall.call_id,
          output: JSON.stringify(toolRes),
        },
      );
    }

    // Make the follow-up request including the tool outputs.
    currentResponse = await fetchResponsesMessage(body);
  }
}

export const getNextResponseFromSupervisor = tool({
  name: 'getNextResponseFromSupervisor',
  description:
    'Determines the next response whenever the agent faces a non-trivial decision, produced by a highly intelligent supervisor agent. Returns a message describing what to do next.',
  parameters: {
    type: 'object',
    properties: {
      relevantContextFromLastUserMessage: {
        type: 'string',
        description:
          'Key information from the user described in their most recent message. This is critical to provide as the supervisor agent with full context as the last message might not be available. Okay to omit if the user message didn\'t add any new information.',
      },
    },
    required: ['relevantContextFromLastUserMessage'],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    const { relevantContextFromLastUserMessage } = input as {
      relevantContextFromLastUserMessage: string;
    };

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    const history: RealtimeItem[] = (details?.context as any)?.history ?? [];
    const filteredLogs = history.filter((log) => log.type === 'message');

    const body: any = {
      model: 'gpt-4.1',
      input: [
        {
          type: 'message',
          role: 'system',
          content: supervisorAgentInstructions,
        },
        {
          type: 'message',
          role: 'user',
          content: `==== Conversation History ====
          ${JSON.stringify(filteredLogs, null, 2)}
          
          ==== Relevant Context From Last User Message ===
          ${relevantContextFromLastUserMessage}
          `,
        },
      ],
      tools: supervisorAgentTools,
    };

    const response = await fetchResponsesMessage(body);
    if (response.error) {
      return { error: 'Something went wrong.' };
    }

    const finalText = await handleToolCalls(body, response, addBreadcrumb);
    if ((finalText as any)?.error) {
      return { error: 'Something went wrong.' };
    }

    return { nextResponse: finalText as string };
  },
});
  