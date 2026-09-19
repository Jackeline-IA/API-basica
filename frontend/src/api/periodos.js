import { client } from './client';

export const listar = (params) => client.get('/periodos/', { params }).then((r) => r.data);
export const obtener = (id) => client.get(`/periodos/${id}/`).then((r) => r.data);
export const crear = (datos) => client.post('/periodos/', datos).then((r) => r.data);
export const actualizar = (id, datos) => client.put(`/periodos/${id}/`, datos).then((r) => r.data);
export const eliminar = (id) => client.delete(`/periodos/${id}/`);