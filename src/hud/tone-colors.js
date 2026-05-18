// Maps coach `tone` (info / warn / good / bad) to a 3-colour palette.
// Used by panels that need to tint themselves to match the coach mood.

export const TONE_COLOR = {
  info: { bg: 'rgba(20,30,50,0.92)',  accent: '#7ec8ff', text: '#fff' },
  warn: { bg: 'rgba(80,55,10,0.95)',  accent: '#f5b81d', text: '#fff' },
  good: { bg: 'rgba(20,60,30,0.95)',  accent: '#7ce69a', text: '#fff' },
  bad:  { bg: 'rgba(80,20,20,0.96)',  accent: '#ff8a7a', text: '#fff' },
};
