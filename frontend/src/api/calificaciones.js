import { client } from './client';

export const listar = (params) =>
  client.get('/calificaciones/', { params }).then((r) => r.data);

export const obtener = (id) =>
  client.get(`/calificaciones/${id}/`).then((r) => r.data);

export const crear = (datos) =>
  client.post('/calificaciones/', datos).then((r) => r.data);

export const actualizar = (id, datos) =>
  client.put(`/calificaciones/${id}/`, datos).then((r) => r.data);

export const eliminar = (id) =>
  client.delete(`/calificaciones/${id}/`);