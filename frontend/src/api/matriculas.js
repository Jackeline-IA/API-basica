import { client } from './client';

export const listar = (params) => client.get('/matriculas/', { params }).then((r) => r.data);
export const obtener = (id) => client.get(`/matriculas/${id}/`).then((r) => r.data);
export const crear = (datos) => client.post('/matriculas/', datos).then((r) => r.data);
export const actualizar = (id, datos) => client.put(`/matriculas/${id}/`, datos).then((r) => r.data);
export const eliminar = (id) => client.delete(`/matriculas/${id}/`);