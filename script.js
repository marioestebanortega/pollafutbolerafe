function mostrarLoader(mensaje) {
  document.getElementById('loader').style.display = 'flex';
  document.getElementById('main-content').style.display = 'none';
  if (mensaje) {
    document.querySelector('#loader .mt-3').innerHTML = mensaje + ' <span style="font-size:2rem;">⚽</span>';
  } else {
    document.querySelector('#loader .mt-3').innerHTML = 'Cargando <span style="font-size:2rem;">⚽</span>';
  }
}
function ocultarLoader() {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('main-content').style.display = '';
}

function cargarResultados() {
  mostrarLoader();
  fetch('http://127.0.0.1:10000/resultados')
    .then(res => {
      if (!res.ok) {
        return res.json().then(data => {
          throw new Error(data.error || 'Error al obtener los datos');
        });
      }
      return res.json();
    })
    .then(data => {
      ocultarLoader();
      document.getElementById('league-logo').src = data.equipos.league.logo;
      document.getElementById('home-logo').src = data.equipos.home.logo;
      document.getElementById('away-logo').src = data.equipos.away.logo;
      document.getElementById('home-name').textContent = data.equipos.home.name;
      document.getElementById('away-name').textContent = data.equipos.away.name;
      document.getElementById('match-title').textContent = `${data.equipos.home.name} vs ${data.equipos.away.name}`;
      document.getElementById('main-score').textContent = data.resultado_real.final_score;
      document.getElementById('estadio-info').textContent = `${data.estadio.nombre}, ${data.estadio.ciudad}`;
      let statusText = data.status.estado;
      if (data.status.tiempo_extra) {
          statusText += ` (${data.status.minutos}+${data.status.tiempo_extra}')`;
      } else {
          statusText += ` (${data.status.minutos}')`;
      }
      document.getElementById('status-info').textContent = statusText;
      const tbody = document.querySelector('#resultados-table tbody');
      tbody.innerHTML = '';
      data.resultados.forEach(r => {
        let predLogo = '';
        if (r.predictions.winner.toLowerCase() === 'local') {
          predLogo = `<img src="${data.equipos.home.logo}" alt="Local" style="height:32px;">`;
        } else if (r.predictions.winner.toLowerCase() === 'visitante') {
          predLogo = `<img src="${data.equipos.away.logo}" alt="Visitante" style="height:32px;">`;
        } else {
          predLogo = `<span class="fs-3 fw-bold text-primary">E</span>`;
        }
        tbody.innerHTML += `
          <tr>
            <td>${r.posicion}</td>
            <td>${r.name}</td>
            <td>${r.score}</td>
            <td class="text-center">${predLogo}</td>
            <td>${r.predictions.winner}</td>
            <td>${r.predictions.final_score}</td>
            <td>${r.predictions.first_half}</td>
            <td>${r.predictions.second_half}</td>
          </tr>
        `;
      });
    })
    .catch(err => {
      ocultarLoader();
      document.getElementById('main-content').innerHTML = `
        <div class="alert alert-danger text-center mt-5">
          <h4 class="alert-heading">Error</h4>
          <p>${err.message}</p>
          <hr>
          <p class="mb-0">Por favor, intente nuevamente en unos minutos.</p>
        </div>
      `;
      console.error('Error al hacer fetch a /resultados:', err);
    });
}

// Llama una vez al cargar la página
cargarResultados();
// Y luego cada 60 segundos (60000 ms)
setInterval(cargarResultados, 60000);