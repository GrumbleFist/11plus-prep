// Profile layer — tiny multi-user switcher for Dorothy & Arnold.
// Stores active profile ID in localStorage; everything else (IndexedDB,
// learner XP state) is namespaced by this ID elsewhere.

const ACTIVE_KEY = '11plus-active-profile';

export const PROFILES = {
  dorothy: {
    id: 'dorothy',
    name: 'Dorothy',
    icon: 'assets/images/Dorothy/Dorothy Icon.png',
    subjectIcons: {
      english: 'assets/images/Dorothy/English Icon.png',
      maths: 'assets/images/Dorothy/Maths Icon.png',
      verbal: 'assets/images/Dorothy/Verbal Reasoning Icon.png',
      nonverbal: 'assets/images/Dorothy/Non-Verbal Reasoning Icon.png'
    }
  },
  arnold: {
    id: 'arnold',
    name: 'Arnold',
    icon: 'assets/images/Arnold/Arnold Icon.png',
    subjectIcons: {
      english: 'assets/images/Arnold/English Icon.png',
      maths: 'assets/images/Arnold/Maths Icon.png',
      verbal: 'assets/images/Arnold/Verbal Reasoning Icon.png',
      nonverbal: 'assets/images/Arnold/Non-Verbal Reasoning Icon.png'
    }
  }
};

export function getActiveProfile() {
  try {
    const id = localStorage.getItem(ACTIVE_KEY);
    return id && PROFILES[id] ? id : null;
  } catch {
    return null;
  }
}

export function getActiveProfileMeta() {
  const id = getActiveProfile();
  return id ? PROFILES[id] : null;
}

export function setActiveProfile(id) {
  if (!PROFILES[id]) throw new Error(`Unknown profile: ${id}`);
  localStorage.setItem(ACTIVE_KEY, id);
}

export function clearActiveProfile() {
  localStorage.removeItem(ACTIVE_KEY);
}

export function profileStorageKey(baseKey) {
  const id = getActiveProfile() || 'guest';
  return `${baseKey}-${id}`;
}
