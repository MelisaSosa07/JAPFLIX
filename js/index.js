let moviesData = [];  // Variable para almacenar todas las películas

// Cargar datos de las películas al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())
    .then(data => {
      moviesData = data;  // Guardamos la lista de películas en moviesData
    })
    .catch(error => console.error('Error al cargar las películas:', error));
});

// Evento de búsqueda
document.getElementById('btnBuscar').addEventListener('click', () => {
  const query = document.getElementById('inputBuscar').value.toLowerCase();
  const resultList = document.getElementById('lista');
  resultList.innerHTML = '';  // Limpiar resultados anteriores

  if (query) {
    const filteredMovies = moviesData.filter(movie =>
      movie.title.toLowerCase().includes(query) ||
      movie.genres.join(', ').toLowerCase().includes(query) ||
      movie.tagline.toLowerCase().includes(query) ||
      movie.overview.toLowerCase().includes(query)
    );

    // Mostrar las películas filtradas
    filteredMovies.forEach(movie => {
      const movieElement = document.createElement('li');
      movieElement.classList.add('list-group-item', 'bg-dark', 'text-light');
      movieElement.innerHTML = `
        <h5>${movie.title}</h5>
        <p>${movie.tagline}</p>
        <div class="stars">${getStars(movie.vote_average)}</div>
        <button class="btn btn-info mt-2" onclick="toggleMovieDetails(event, ${JSON.stringify(movie)})">Detalles</button>
        <div class="movie-details mt-2" style="display:none;"></div>
      `;
      resultList.appendChild(movieElement);
    });
  }
});

// Función para mostrar estrellas según el rating
function getStars(voteAverage) {
  const starsTotal = 5;
  const rating = Math.round(voteAverage / 2);  // Escalar de 0-10 a 0-5
  let starsHtml = '';

  for (let i = 0; i < starsTotal; i++) {
    starsHtml += i < rating ? '<span class="fa fa-star checked"></span>' : '<span class="fa fa-star"></span>';
  }
  return starsHtml;
}

// Función para mostrar/ocultar los detalles de la película
function toggleMovieDetails(event, movie) {
  const detailsElement = event.target.nextElementSibling; // Obtener el contenedor de detalles

  if (detailsElement.style.display === "none" || detailsElement.style.display === "") {
    detailsElement.innerHTML = `
      <p><strong>Descripción:</strong> ${movie.overview}</p>
      <p><strong>Géneros:</strong> ${movie.genres.join(', ')}</p>
      <button class="btn btn-secondary dropdown-toggle" type="button" id="toggleDetails" data-bs-toggle="dropdown">Más información</button>
      <div class="dropdown-menu">
        <p class="dropdown-item">Año de lanzamiento: ${movie.release_date.split('-')[0]}</p>
        <p class="dropdown-item">Duración: ${movie.runtime} minutos</p>
        <p class="dropdown-item">Presupuesto: $${movie.budget}</p>
        <p class="dropdown-item">Ganancias: $${movie.revenue}</p>
      </div>
    `;
    detailsElement.style.display = "block"; // Mostrar detalles
  } else {
    detailsElement.style.display = "none"; // Ocultar detalles
  }
}
