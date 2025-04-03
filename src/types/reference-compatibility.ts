
// This file adds compatibility for different reference types in the system

import { Reference } from '@/types';

// Convert URL-based reference to Link-based reference (for compatibility)
export function toStandardReference(ref: { title: string; url: string; snippet: string }): Reference {
  return {
    title: ref.title,
    link: ref.url, // Map url to link for compatibility
    snippet: ref.snippet
  };
}

// Convert array of URL-based references to Link-based references
export function toStandardReferences(refs: { title: string; url: string; snippet: string }[]): Reference[] {
  return refs.map(toStandardReference);
}

// Convert when title/url/snippet might be dynamic (any type)
export function toDynamicReference(ref: { title: any; url: any; snippet: any }): Reference {
  return {
    title: String(ref.title || ''),
    link: String(ref.url || ''), // Map url to link for compatibility
    snippet: String(ref.snippet || '')
  };
}
