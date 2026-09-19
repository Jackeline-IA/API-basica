import { client } from './client';

export const listar = (params) =>
  client.get('/estudiantes/', { params }).then((r) => r.data);

export const obtener = (id) =>
  client.get(`/estudiantes/${id}/`).then((r) => r.data);

export const crear = (datos) =>
  client.post('/estudiantes/', datos).then((r) => r.data);

export const actualizar = (id, datos) =>
  client.put(`/estudiantes/${id}/`, datos).then((r) => r.data);

export const eliminar = (id) =>
  client.delete(`/estudiantes/${id}/`);