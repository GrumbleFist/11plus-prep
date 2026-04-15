// IndexedDB wrapper for progress and answer storage

const DB_NAME = '11plus';
const DB_VERSION = 1;
let db = null;

export async function init() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Store individual answers
      if (!db.objectStoreNames.contains('answers')) {
        const store = db.createObjectStore('answers', { keyPath: 'id' });
        store.createIndex('subject', 'subject', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('questionId', 'questionId', { unique: false });
      }

      // Store progress per subject
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'subject' });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve();
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };
  });
}

export async function saveAnswer(answer) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('answers', 'readwrite');
    tx.objectStore('answers').put(answer);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

export async function getAnswers(subject = null) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('answers', 'readonly');
    const store = tx.objectStore('answers');
    let request;

    if (subject) {
      const index = store.index('subject');
      request = index.getAll(subject);
    } else {
      request = store.getAll();
    }

    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function saveProgress(progress) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('progress', 'readwrite');
    tx.objectStore('progress').put(progress);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

export async function getProgress(subject) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('progress', 'readonly');
    const request = tx.objectStore('progress').get(subject);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function getAllProgress() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('progress', 'readonly');
    const request = tx.objectStore('progress').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });
}
