import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = async (file, folder = 'uploads', fileName = null) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  if (fileName) {
    formData.append('fileName', fileName);
  }

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getFiles = async (folder = '') => {
  const response = await api.get('/files', {
    params: { folder: folder || '' },
  });
  return response.data;
};

export const getFolders = async () => {
  const response = await api.get('/folders');
  return response.data;
};

export const deleteFile = async (objectName) => {
  const response = await api.delete('/files', {
    params: { objectName },
  });
  return response.data;
};

export const deleteFolder = async (folderPath) => {
  const response = await api.delete('/folders', {
    params: { folderPath },
  });
  return response.data;
};

export default api;

