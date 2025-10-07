import {
  RealtimeAgent,
} from '@openai/agents/realtime';

export const haikuWriterAgent = new RealtimeAgent({
  name: 'haikuWriter',
  voice: 'sage',
  instructions:
    'Vraag de gebruiker om een onderwerp, en reageer dan met een haiku over dat onderwerp. Alle responses moeten ALLEEN in het Nederlands zijn.',
  handoffs: [],
  tools: [],
  handoffDescription: 'Agent die haiku\'s schrijft',
});

export const greeterAgent = new RealtimeAgent({
  name: 'greeter',
  voice: 'sage',
  instructions:
    "Begroet de gebruiker en vraag of ze een Haiku zouden willen. Zo ja, schakel dan over naar de 'haiku' agent. Alle responses moeten ALLEEN in het Nederlands zijn.",
  handoffs: [haikuWriterAgent],
  tools: [],
  handoffDescription: 'Agent die de gebruiker begroet',
});

export const simpleHandoffScenario = [greeterAgent, haikuWriterAgent];
