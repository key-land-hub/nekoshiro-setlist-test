/* app.js */

const cards = document.getElementById('cards'); 
const sidePanel = document.getElementById('sidePanel'); 
const statsPanel = document.getElementById('statsPanel');
const favoritePanel = document.getElementById('favoritePanel');
const tagPanel = document.getElementById('tagPanel');

document.getElementById('showBoth').onclick = () => {
  cards.style.display = '';
  sidePanel.style.display = '';

  statsPanel.style.display = '';
  favoritePanel.style.display = '';
  tagPanel.style.display = '';

  localStorage.setItem('viewMode', 'both');
};

document.getElementById('showSongs').onclick = () => {
  cards.style.display = '';
  sidePanel.style.display = 'none';

  localStorage.setItem('viewMode', 'songs');
};

document.getElementById('showStats').onclick = () => {
  cards.style.display = 'none';
  sidePanel.style.display = '';

  statsPanel.style.display = '';
  favoritePanel.style.display = 'none';
  tagPanel.style.display = 'none';

  localStorage.setItem('viewMode', 'stats');
};

document.getElementById('showFavorites').onclick = () => {
  cards.style.display = 'none';
  sidePanel.style.display = '';

  statsPanel.style.display = 'none';
  favoritePanel.style.display = '';
  tagPanel.style.display = 'none';

  localStorage.setItem('viewMode', 'favorites');
};

document.getElementById('showTags').onclick = () => {
  cards.style.display = 'none';
  sidePanel.style.display = '';

  statsPanel.style.display = 'none';
  favoritePanel.style.display = 'none';
  tagPanel.style.display = '';

  localStorage.setItem('viewMode', 'tags');
};

const search = document.getElementById('search')

const totalStreams = streams.length

const totalSongs = streams.reduce((sum, stream) => {
  return sum + stream.songs.length
}, 0)

const uniqueSongs = new Set()

streams.forEach(stream => {
  stream.songs.forEach(song => {
    uniqueSongs.add(song.name)
  })
})

document.getElementById('stats').innerHTML = `
  配信数：${totalStreams}<br>
  総歌唱数：${totalSongs}曲<br>
  曲数：${uniqueSongs.size}曲
`

const counts = {}

streams.forEach(stream => {
  stream.songs.forEach(song => {
    const name = song.name
    counts[name] = (counts[name] || 0) + 1
  })
})

const ranking = Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 100)

document.getElementById('ranking').innerHTML =
  ranking
    .map((item, index) =>
      `${index + 1}. ${item[0]} (${item[1]}回)`
    )
    .join('<br>')

const counts2026 = {}

streams
  .filter(stream => stream.date.startsWith("2026/"))
  .forEach(stream => {
    stream.songs.forEach(song => {
      counts2026[song.name] =
        (counts2026[song.name] || 0) + 1
    })
  })

const ranking2026 = Object.entries(counts2026)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)

document.getElementById('ranking2026').innerHTML =
  ranking2026
    .map((item, index) =>
      `${index + 1}. ${item[0]} (${item[1]}回)`
    )
    .join('<br>')

const counts2025 = {}

streams
  .filter(stream => stream.date.startsWith("2025/"))
  .forEach(stream => {
    stream.songs.forEach(song => {
      counts2025[song.name] =
        (counts2025[song.name] || 0) + 1
    })
  })

const ranking2025 = Object.entries(counts2025)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)

document.getElementById('ranking2025').innerHTML =
  ranking2025
    .map((item, index) =>
      `${index + 1}. ${item[0]} (${item[1]}回)`
    )
    .join('<br>')

const counts2024 = {}

streams
  .filter(stream => stream.date.startsWith("2024/"))
  .forEach(stream => {
    stream.songs.forEach(song => {
      counts2024[song.name] =
        (counts2024[song.name] || 0) + 1
    })
  })

const ranking2024 = Object.entries(counts2024)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)

document.getElementById('ranking2024').innerHTML =
  ranking2024
    .map((item, index) =>
      `${index + 1}. ${item[0]} (${item[1]}回)`
    )
    .join('<br>')

function render(keyword='') {
  cards.innerHTML=''

  streams
    .filter(stream => {
      const text = (
        stream.date +
        stream.title +
        stream.theme +
        stream.songs
          .map(song => `${song.name} ${song.type || ''}`)
          .join(' ')
      ).toLowerCase()

      const keywords = keyword
        .toLowerCase()
        .split(' ')
        .filter(v => v)

      return keywords.every(word =>
        text.includes(word)
      )

    })
    .forEach(stream => {
      const el = document.createElement('div')
      el.className='card'

      el.innerHTML = `
        <div class="card-header">
          <div class="date">${stream.date}</div>
          <div class="title">${stream.title}</div>
          <div class="theme">
           ${stream.theme.map(tag =>
            `<span class="tag stream-tag">${tag}</span>`
           ).join('')}
          </div>
          <br>
          <a class="main-link" href="${stream.url}" target="_blank">
            YouTube配信を開く ↗
          </a>
        </div>

        <div class="song-list">
          ${stream.songs.map(song => ` 
            <div
              class="song-row"
              data-date="${stream.date}"
              data-title="${stream.title}"
              data-url="${song.url}"
            >

            <a class="song" href="${song.url}" target="_blank"> 
              ▶ ${song.type 
                ? `${song.name} [${song.type}]` 
                : song.name} 
            </a> 

            <button class="favorite-btn">🤍</button>
 
            </div> 
          `).join('')}
        </div>
      `

      cards.appendChild(el)
    })

}

function normalizeDate(dateStr){
  const cleaned = dateStr.replace(/－.*/, '').trim()
  const parts = cleaned.split('/')
  return new Date(parts[0], parts[1]-1, parts[2])
}

streams.sort((a,b)=>{
  return normalizeDate(b.date)-normalizeDate(a.date)
})

search.addEventListener('input', e => {
  render(e.target.value)

})

document.addEventListener('click', e => {
  if (!e.target.classList.contains('tag')) return

  const tag = e.target.textContent
  let keywords = search.value
    .split(' ')
    .filter(v => v)

  if (keywords.includes(tag)) {
    // もう一度押したら解除
    keywords = keywords.filter(v => v !== tag)
  } else {
    // 追加
    keywords.push(tag)
  }

  search.value = keywords.join(' ')
  render(search.value)
})

// タグ検索で再描画された時もハートを復元
const originalRender = render

render = function(keyword = '') {
  originalRender(keyword)

  if (window.loadFavorites) {
    window.loadFavorites()
  }
}

const savedMode = localStorage.getItem('viewMode');

switch(savedMode){

  case 'songs':
    document.getElementById('showSongs').click();
    break;

  case 'stats':
    document.getElementById('showStats').click();
    break;

  case 'favorites':
    document.getElementById('showFavorites').click();
    break;

  case 'tags':
    document.getElementById('showTags').click();
    break;

  default:
    document.getElementById('showBoth').click();
}

render()

document.getElementById('clearSearch')
  .addEventListener('click', () => {

    search.value = ''
    render()
    search.focus()

})
