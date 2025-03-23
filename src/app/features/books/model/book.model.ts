export interface IBook {
	id: number
	titulo: string
	fecha_publicacion: Date
	genero: string
	resumen?: string
	autor: string
	numero_paginas?: number
	numero_libros: number
	disponible: boolean
	_count: Count
	deshabilitar: boolean
}

export interface Count {
	prestamos: number
}
