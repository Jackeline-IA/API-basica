import { client } from './client';

export const listar = (params) => client.get('/evaluaciones/', { params }).then((r) => r.data);
export const obtener = (id) => client.get(`/evaluaciones/${id}/`).then((r) => r.data);
export const crear = (datos) => client.post('/evaluaciones/', datos).then((r) => r.data);
export const actualizar = (id, datos) => client.put(`/evaluaciones/${id}/`, datos).then((r) => r.data);
export const eliminar = (id) => client.delete(`/evaluaciones/${id}/`);