/**
 * Native File System Access API Wrapper & Storage Engine
 * Inspired by CypherNinjaa/study_schedule fileStorage.ts architecture.
 *
 * Primary path: Direct read/write to a real JSON file on disk via showOpenFilePicker/showSaveFilePicker.
 * Handle persistence: FileSystemFileHandle stored in IndexedDB (idb-keyval) for auto-reconnect on refresh.
 * Fallback path: Seamless IndexedDB mirror + standard File Upload & Download export.
 */

import { get, set, del } from 'idb-keyval';
import defaultQuizData from '../data/defaultQuizData.json';

const HANDLE_KEY = 'prakriti_quiz:file_handle';
const MIRROR_KEY = 'prakriti_quiz:data_mirror';
export const DEFAULT_FILE_NAME = 'prakriti_utsav_quiz.json';

let currentFileHandle = null;

/**
 * Checks if the native File System Access API is supported by the current browser.
 */
export function isFileSystemAccessSupported() {
  return typeof window !== 'undefined' && 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;
}

/**
 * Gets the currently active file handle.
 */
export function getActiveFileHandle() {
  return currentFileHandle;
}

/**
 * Gets the current active file name or null.
 */
export function getActiveFileName() {
  return currentFileHandle ? currentFileHandle.name : null;
}

/**
 * Validates quiz data schema structure.
 */
export function validateQuizData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data format: expected a JSON object.');
  }
  if (!Array.isArray(data.questions)) {
    throw new Error('Invalid format: "questions" array is required.');
  }
  if (!Array.isArray(data.participants)) {
    data.participants = [];
  }
  if (!data.config || typeof data.config !== 'object') {
    data.config = { ...defaultQuizData.config };
  }
  return data;
}

/**
 * Reads and parses data from a FileSystemFileHandle.
 */
async function readFileFromHandle(handle) {
  const file = await handle.getFile();
  const text = await file.text();
  const parsed = JSON.parse(text);
  return validateQuizData(parsed);
}

/**
 * Writes data directly to disk via FileSystemFileHandle stream.
 */
async function writeFileToHandle(handle, data) {
  const writable = await handle.createWritable();
  const jsonString = JSON.stringify(data, null, 2);
  await writable.write(jsonString);
  await writable.close();
}

/**
 * Loads initial data on app startup:
 * 1. Checks if a file handle was previously connected in IndexedDB.
 * 2. If handle exists and permission is granted, reads directly from disk.
 * 3. Falls back to IndexedDB local mirror if available.
 * 4. Falls back to bundled defaultQuizData.json.
 */
export async function loadInitialData() {
  // 1. Try to restore previous file handle
  try {
    const storedHandle = await get(HANDLE_KEY);
    if (storedHandle && typeof storedHandle.getFile === 'function') {
      currentFileHandle = storedHandle;
      
      // Verify query permission without prompting
      if (storedHandle.queryPermission) {
        const status = await storedHandle.queryPermission({ mode: 'readwrite' });
        if (status === 'granted') {
          const fileData = await readFileFromHandle(storedHandle);
          await set(MIRROR_KEY, fileData);
          return {
            data: fileData,
            source: 'file',
            fileName: storedHandle.name,
            needsPermissionPrompt: false
          };
        } else {
          // Stored handle exists but requires a user click to re-grant permission
          const mirror = await get(MIRROR_KEY);
          return {
            data: mirror ? validateQuizData(mirror) : defaultQuizData,
            source: 'pending_permission',
            fileName: storedHandle.name,
            needsPermissionPrompt: true
          };
        }
      }
    }
  } catch (err) {
    console.warn('Could not restore stored file handle:', err);
  }

  // 2. Check local mirror in IndexedDB
  try {
    const mirror = await get(MIRROR_KEY);
    if (mirror) {
      return {
        data: validateQuizData(mirror),
        source: 'local_mirror',
        fileName: null,
        needsPermissionPrompt: false
      };
    }
  } catch (err) {
    console.warn('Could not read local mirror:', err);
  }

  // 3. Fallback to bundled default data
  return {
    data: defaultQuizData,
    source: 'default',
    fileName: null,
    needsPermissionPrompt: false
  };
}

/**
 * Re-requests permission for an existing handle (must be called from user gesture).
 */
export async function reAuthorizeStoredHandle() {
  if (!currentFileHandle || !currentFileHandle.requestPermission) {
    throw new Error('No active file handle to re-authorize.');
  }
  const status = await currentFileHandle.requestPermission({ mode: 'readwrite' });
  if (status === 'granted') {
    const fileData = await readFileFromHandle(currentFileHandle);
    await set(MIRROR_KEY, fileData);
    return { data: fileData, fileName: currentFileHandle.name };
  } else {
    throw new Error('Permission not granted to access the file.');
  }
}

/**
 * Prompts user to pick an existing JSON file from disk.
 */
export async function connectExistingFile() {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API is not supported in this browser. Please use the Import File option.');
  }

  const [handle] = await window.showOpenFilePicker({
    types: [
      {
        description: 'Prakriti Utsav Quiz JSON (*.json)',
        accept: { 'application/json': ['.json'] }
      }
    ],
    multiple: false
  });

  if (!handle) {
    throw new Error('No file selected.');
  }

  const data = await readFileFromHandle(handle);
  currentFileHandle = handle;
  
  // Persist handle in IndexedDB
  await set(HANDLE_KEY, handle);
  await set(MIRROR_KEY, data);

  return {
    data,
    fileName: handle.name,
    handle
  };
}

/**
 * Prompts user to create and save a new JSON file on disk.
 */
export async function createNewFile(seedData = defaultQuizData) {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API is not supported in this browser. You can export/download the JSON file instead.');
  }

  const handle = await window.showSaveFilePicker({
    suggestedName: DEFAULT_FILE_NAME,
    types: [
      {
        description: 'Prakriti Utsav Quiz JSON (*.json)',
        accept: { 'application/json': ['.json'] }
      }
    ]
  });

  if (!handle) {
    throw new Error('File creation cancelled.');
  }

  const dataToSave = validateQuizData(seedData);
  await writeFileToHandle(handle, dataToSave);
  
  currentFileHandle = handle;
  await set(HANDLE_KEY, handle);
  await set(MIRROR_KEY, dataToSave);

  return {
    data: dataToSave,
    fileName: handle.name,
    handle
  };
}

/**
 * Saves updated data:
 * - Writes to connected JSON file on disk if handle exists.
 * - Always updates IndexedDB mirror so data is never lost.
 */
export async function saveQuizData(updatedData) {
  const validated = validateQuizData(updatedData);
  
  // Always mirror to IndexedDB
  await set(MIRROR_KEY, validated);

  // Write to disk if handle is active
  if (currentFileHandle) {
    try {
      await writeFileToHandle(currentFileHandle, validated);
      return { success: true, savedToFile: true, fileName: currentFileHandle.name };
    } catch (err) {
      console.error('Failed to write directly to disk handle:', err);
      return { success: true, savedToFile: false, savedToMirror: true, error: err.message };
    }
  }

  return { success: true, savedToFile: false, savedToMirror: true };
}

/**
 * Disconnects the currently attached file handle.
 */
export async function disconnectFile() {
  currentFileHandle = null;
  await del(HANDLE_KEY);
}

/**
 * Exports data as a downloadable .json file (universal fallback).
 */
export function exportDataAsJSON(data, filename = DEFAULT_FILE_NAME) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Reads uploaded JSON from an HTML <input type="file"> element.
 */
export function importUploadedJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const validated = validateQuizData(parsed);
        await set(MIRROR_KEY, validated);
        resolve({ data: validated, fileName: file.name });
      } catch (err) {
        reject(new Error('Invalid JSON file format: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read uploaded file.'));
    reader.readAsText(file);
  });
}
