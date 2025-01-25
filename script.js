document.addEventListener('DOMContentLoaded', () => {
    let currentPageIndex = 0;
    let currentKeywordIndex = 0;
    let data;
  
    // Carica il JSON
    fetch('data.json')
      .then(response => response.json())
      .then(json => {
        data = json;
        renderHome();
        renderPages();
        renderGlossary();
        renderFooter();
        showPage('home');
      });
  
    // Renderizza la Home Page
    function renderHome() {
      document.getElementById('home-title').innerText = data.home.title;
      document.getElementById('home-subtitle').innerText = data.home.subtitle;
      const actionsContainer = document.getElementById('home-actions');
      data.home.actions.forEach(action => {
        const button = document.createElement('button');
        button.innerText = action.text;
        button.addEventListener('click', () => showPage(action.link.replace('#', '')));
        actionsContainer.appendChild(button);
      });
    }
  
    // Renderizza le Pagine Standard e Custom
    function renderPages() {
      const pagesContainer = document.getElementById('pages');
      data.pages.forEach(page => {
        const pageElement = document.createElement('div');
        pageElement.id = page.id;
        pageElement.className = 'page';
        pageElement.innerHTML = `
          <div class="content">
            <h1>${page.title}</h1>
            <h2>${page.subtitle}</h2>
            ${page.type === 'standard' ? `
              <div class="keyword-content">
                <div class="keyword-list">
                  ${page.keywords.map((keyword, index) => `
                    <div class="keyword-item" data-index="${index}">${keyword.name}</div>
                  `).join('')}
                </div>
                <div class="keyword-image">
                  <img src="${page.keywords[0].image}" alt="${page.keywords[0].name}">
                  <p>${page.keywords[0].concept}</p>
                </div>
              </div>
            ` : `
              <div class="custom-content">
                <p>${page.content.text}</p>
                <img src="${page.content.image}" alt="${page.title}">
              </div>
            `}
          </div>
        `;
        pagesContainer.appendChild(pageElement);
      });
    }
  
    // Renderizza il Glossario
    function renderGlossary() {
      document.getElementById('glossary-title').innerText = data.glossary.title;
      const glossaryList = document.getElementById('glossary-list');
      data.glossary.keywords.forEach(keyword => {
        const li = document.createElement('li');
        li.innerText = keyword.name;
        li.addEventListener('click', () => alert(keyword.concept));
        glossaryList.appendChild(li);
      });
    }
  
    // Renderizza il Footer
    function renderFooter() {
      document.getElementById('footer-title').innerText = data.footer.title;
      document.getElementById('footer-quote').innerText = data.footer.quote;
      const footerLinks = document.getElementById('footer-links');
      data.footer.links.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.url;
        a.innerText = link.text;
        a.title = link.description;
        li.appendChild(a);
        footerLinks.appendChild(li);
      });
    }
  
    // Mostra una pagina specifica
    function showPage(pageId) {
      document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
      document.getElementById(pageId).classList.add('active');
    }
  
    // Navigazione da tastiera
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        // Passa al concetto successivo
      } else if (event.key === 'ArrowLeft') {
        // Passa al concetto precedente
      } else if (event.key === 'ArrowDown') {
        // Passa alla pagina successiva
      } else if (event.key === 'ArrowUp') {
        // Passa alla pagina precedente
      }
    });
  });