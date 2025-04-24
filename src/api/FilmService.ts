import { FILMS_URL } from "../utils/constansts";

export default class FilmService {
  static async getAllFilms(signal: AbortSignal) {
    const responce = await fetch(FILMS_URL, {
      method: 'GET',
      credentials: 'include',
      signal: signal || null,
    })

    if (responce.ok !== true) {
      const error = await responce.json();
      throw new Error(`Запрос завершился с ошибкой: ${error.errorText}`);
    };
    if (responce.ok === true) {
      return await responce.json();
    }
  }

  static async postFilm(filmTitle: string) {
    const json = JSON.stringify({ title: filmTitle })

    const responce = await fetch(FILMS_URL, {
      method: 'POST',
      credentials: 'include',
      body: json,
    })

    if (responce.ok !== true) {
      const error = await responce.json();
      throw new Error(`Запрос завершился с ошибкой: ${error.errorText}`);
    };
    if (responce.ok === true) {
      return await responce.json();
    }
  }

  static async deleteFilm(filmId: number) {
    const data = JSON.stringify({ id: filmId })
    const responce = await fetch(FILMS_URL, {
      method: 'DELETE',
      credentials: 'include',
      body: data,
    })

    if (responce.ok !== true) {
      const data = await responce.json();
      throw new Error(`Запрос завершился с ошибкой: ${data.errorText}`)
    };
    if (responce.ok === true) {
      return await responce;
    }
  }
}