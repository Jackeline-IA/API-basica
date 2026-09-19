import { client } from './client';

export const listar = (params) => client.get('/docentes/', { params }).then((r) => r.data);
export const obtener = (id) => client.get(`/docentes/${id}/`).then((r) => r.data);
export const crear = (datos) => client.post('/docentes/', datos).then((r) => r.data);
export const actualizar = (id, datos) => client.put(`/docentes/${id}/`, datos).then((r) => r.data);
export const eliminar = (id) => client.delete(`/docentes/${id}/`);