const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      const characters = response.results;
      const next_fetch = response.info.next;
      localStorage.setItem("next_fetch", next_fetch);
      if (localStorage.next_fetch) {
        console.log(`next_fetch creada exitosamente en localSorage con el valor: ${localStorage.next_fetch}`);
      }

      let output = characters.map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `
      }).join('');
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
}

let llamadasALaAPI = 0;

const loadData = async () => {
  try {
    if (localStorage.next_fetch===null || llamadasALaAPI===0) {
      localStorage.removeItem('next_fetch');
      await getData(API)
      llamadasALaAPI++;      
    } else if (localStorage.next_fetch!=="") {
      await getData(`${localStorage.next_fetch}`)
      llamadasALaAPI++;
    } else {
      alert('Ya no hay personajes...');
      intersectionObserver.unobserve($observe);
    }
  } catch {
  }
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
    console.log(`llamadas: ${llamadasALaAPI}`);
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);