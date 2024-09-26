let moviesData = []; // Almacenar las películas

// Cargar los datos de las películas
window.addEventListener('DOMContentLoaded', () => {
  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())
    .then(data => {
      moviesData = data; // Guardar los datos de las películas
    })
    .catch(error => console.error('Error al cargar las películas:', error));
});

// Filtrar y mostrar resultados
document.getElementById('btnBuscar').addEventListener('click', () => {
  const query = document.getElementById('inputBuscar').value.toLowerCase();
  const resultList = document.getElementById('lista');
  resultList.innerHTML = ''; // Limpiar resultados anteriores

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
        <button class="btn btn-info mt-2" onclick="showMovieDetails(${movie.id})" data-bs-toggle="modal" data-bs-target="#movieModal">Ver detalles</button>
      `;
      resultList.appendChild(movieElement);
    });
  }
});

// Mostrar detalles de la película seleccionada en el modal
function showMovieDetails(movieId) {
  const movie = moviesData.find(m => m.id === movieId);
  if (!movie) return;

  document.getElementById('movieModalLabel').innerText = movie.title;
  document.getElementById('movieOverview').innerText = movie.overview;
  document.getElementById('movieGenres').innerText = movie.genres.join(', ');
  document.getElementById('movieYear').innerText = movie.release_date.split('-')[0];
  document.getElementById('movieDuration').innerText = movie.runtime;
  document.getElementById('movieBudget').innerText = movie.budget.toLocaleString();
  document.getElementById('movieRevenue').innerText = movie.revenue.toLocaleString();

  // Añadir funcionalidad al botón de "Más información"
  const toggleDetailsButton = document.getElementById('toggleDetails');
  toggleDetailsButton.addEventListener('click', () => {
    const extraDetails = document.getElementById('extraDetails');
    extraDetails.style.display = extraDetails.style.display === 'none' || extraDetails.style.display === '' ? 'block' : 'none';
  });
}

// Función para generar estrellas según el rating
function getStars(voteAverage) {
  const starsTotal = 5;
  const rating = Math.round(voteAverage / 2); // Escalar de 0-10 a 0-5
  let starsHtml = '';

  for (let i = 0; i < starsTotal; i++) {
    starsHtml += i < rating ? '<span class="fa fa-star checked"></span>' : '<span class="fa fa-star"></span>';
  }
  return starsHtml;
}
