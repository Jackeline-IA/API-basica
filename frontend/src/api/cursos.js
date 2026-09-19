import { client } from './client';

export const listar = (params) => client.get('/cursos/', { params }).then((r) => r.data);
export const obtener = (id) => client.get(`/cursos/${id}/`).then((r) => r.data);
export const crear = (datos) => client.post('/cursos/', datos).then((r) => r.data);
export const actualizar = (id, datos) => client.put(`/cursos/${id}/`, datos).then((r) => r.data);
export const eliminar = (id) => client.delete(`/cursos/${id}/`);