import { fetchAuthed } from '@/stores/authStore'
import { PageRequest } from '@/lib/request'
import { ActionPayload, PageResponse } from '@/lib/response'
import { GameCatalogForm } from '@/features/game-catalogs/components/game-catalogs-action-dialog'
import { GameCatalogInfo } from '@/features/game-catalogs/data/game-catalog'

export type GameCatalogActionPayload = ActionPayload<number>

export const listGameCatalogs = async (request: PageRequest) => {
  return fetchAuthed<PageResponse<GameCatalogInfo>>(
    `/game-catalog/?page=${request.page}&limit=${request.limit}`
  )
}

export const listAllGameCatalogs = async () => {
  return fetchAuthed<GameCatalogInfo[]>('/game-catalog/all')
}

export const createGameCatalog = async (values: GameCatalogForm) => {
  return fetchAuthed<GameCatalogInfo>('/game-catalog/', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export const updateGameCatalog = async (
  id: number,
  values: GameCatalogForm
) => {
  return fetchAuthed<GameCatalogInfo>(`/game-catalog/${id}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  })
}

export const deleteGameCatalog = async (id: number) => {
  return fetchAuthed<GameCatalogInfo>(`/game-catalog/${id}`, {
    method: 'DELETE',
  })
}

export const createOrUpdateGameCatalog = async (
  values: { id?: number } & GameCatalogForm
) => {
  if (values.id) {
    return updateGameCatalog(values.id, {
      ...values,
      displayOrder: Number(values.displayOrder),
      status: Number(values.status),
    })
  } else {
    return createGameCatalog({
      ...values,
      displayOrder: Number(values.displayOrder),
      status: Number(values.status),
    })
  }
}
