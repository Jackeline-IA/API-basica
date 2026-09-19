import { client } from './client';

export const listar = (params) => client.get('/materias/', { params }).then((r) => r.data);
export const obtener = (id) => client.get(`/materias/${id}/`).then((r) => r.data);
export const crear = (datos) => client.post('/materias/', datos).then((r) => r.data);
export const actualizar = (id, datos) => client.put(`/materias/${id}/`, datos).then((r) => r.data);
export const eliminar = (id) => client.delete(`/materias/${id}/`);