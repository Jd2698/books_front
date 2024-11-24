export interface Ibook {
	id: string
	titulo: string
	fechaPublicacion: Date
	genero: string
	numPaginas?: number
	resumen?: string
	autor: string
	numLibros: number
	disponible: boolean
}
