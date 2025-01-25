document.addEventListener("DOMContentLoaded", () => {
  let currentPageIndex = 0;
  let currentKeywordIndex = 0;
  let data;
  let pages = [];

  // Carica il JSON
  fetch("data.json")
    .then((response) => response.json())
    .then((json) => {
      data = json;
      renderHome();
      renderPages();
      renderGlossary();
      renderFooter();
      showPage("home");
    });

  // Renderizza la Home Page
  function renderHome() {
    const homeContent = document.querySelector("#home .content");

    // Aggiungi il logo
    const logo = document.createElement("img");
    logo.src = "assets/images/logo_.png"; // Percorso del logo
    logo.alt = "Logo";
    logo.className = "logo";
    homeContent.prepend(logo); // Aggiungi il logo all'inizio del contenuto

    // Imposta titolo e sottotitolo
    document.getElementById("home-title").innerText = data.home.title;
    document.getElementById("home-subtitle").innerText = data.home.subtitle;

    // Aggiungi le azioni
    const actionsContainer = document.getElementById("home-actions");
    data.home.actions.forEach((action) => {
      const button = document.createElement("button");
      button.innerText = action.text;
      button.addEventListener("click", () =>
        showPage(action.link.replace("#", ""))
      );
      actionsContainer.appendChild(button);
    });
  }

  // Renderizza le Pagine Standard e Custom
  function renderPages() {

    // Aggiungi la home all'array delle pagine
    const homePage = document.getElementById("home");
    pages.push(homePage);

    const pagesContainer = document.getElementById("pages");
    data.pages.forEach((page, index) => {
      const pageElement = document.createElement("div");
      pageElement.id = page.id;
      pageElement.className = "page";
      pageElement.innerHTML = `
        <div class="content">
          <h1>${page.title}</h1>
          <h2>${page.subtitle}</h2>
          ${
            page.type === "standard"
              ? `
            <div class="keyword-content">
              <div class="keyword-list">
                ${page.keywords
                  .map(
                    (keyword, i) => `
                  <div class="keyword-item" data-index="${i}">${keyword.name}</div>
                `
                  )
                  .join("")}
              </div>
              <div class="keyword-image">
                <img src="${page.keywords[0].image}" alt="${
                  page.keywords[0].name
                }">
                <p>${page.keywords[0].concept}</p>
              </div>
            </div>
          `
              : `
            <div class="custom-content">
              <p>${page.content.text}</p>
              <img src="${page.content.image}" alt="${page.title}">
            </div>
          `
          }
          <!-- Bottoni di navigazione -->
          <div class="navigation-buttons">
            <button class="nav-button prev-button"> ← </button>
            <button class="nav-button next-button"> → </button>
          </div>
        </div>
      `;
      pagesContainer.appendChild(pageElement);
      pages.push(pageElement); // Aggiungi la pagina all'array
    });

    // Aggiungi i listener ai bottoni di navigazione
    setupNavigationButtons();

    // Aggiungi il Glossario all'array delle pagine
    const glossaryPage = document.getElementById("glossary");
    pages.push(glossaryPage);

    // Aggiungi il Footer all'array delle pagine
    const footerPage = document.getElementById("footer");
    pages.push(footerPage);
  }

  function setupNavigationButtons() {
    const prevButtons = document.querySelectorAll(".prev-button");
    const nextButtons = document.querySelectorAll(".next-button");

    prevButtons.forEach((button) => {
      button.addEventListener("click", () => navigatePages("up")); // Pagina precedente
    });

    nextButtons.forEach((button) => {
      button.addEventListener("click", () => navigatePages("down")); // Pagina successiva
    });
  }

  function renderGlossary() {
    document.getElementById("glossary-title").innerText = data.glossary.title;
    const glossaryList = document.getElementById("glossary-list");
    data.glossary.keywords.forEach((keyword) => {
      const li = document.createElement("li");

      // Aggiungi il titolo (parola chiave)
      const title = document.createElement("h3");
      title.innerText = keyword.name;
      li.appendChild(title);

      // Aggiungi il concetto
      const concept = document.createElement("p");
      concept.innerText = keyword.concept;
      li.appendChild(concept);

      // Gestione del click
      li.addEventListener("click", () => {
        showPage(keyword.pageId); // Reindirizza alla pagina specifica
      });

      glossaryList.appendChild(li);
    });
  }

  // Renderizza il Footer
  function renderFooter() {
    document.getElementById("footer-title").innerText = data.footer.title;
    document.getElementById("footer-quote").innerText = data.footer.quote;
    const footerLinks = document.getElementById("footer-links");
    data.footer.links.forEach((link) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link.url;
      a.innerText = link.text;
      a.title = link.description;
      li.appendChild(a);
      footerLinks.appendChild(li);
    });
  }

  // Mostra una pagina specifica
  function showPage(pageId) {
    document
      .querySelectorAll(".page")
      .forEach((page) => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
    currentPageIndex = pages.findIndex((page) => page.id === pageId); // Aggiorna l'indice della pagina corrente

    // Resetta l'indice del concetto solo se la pagina è di tipo "standard"
    if (data.pages[currentPageIndex - 1]?.type === "standard") {
      currentKeywordIndex = 0;
      updateKeywordDisplay(); // Aggiorna la visualizzazione del concetto
      setupKeywordClickListeners(); // Imposta i listener per il click
    }
  }

  // Imposta i listener per il click sulle parole chiave
  function setupKeywordClickListeners() {
    const currentPage = pages[currentPageIndex];
    if (currentPage && data.pages[currentPageIndex - 1]?.type === "standard") {
      const keywordItems = currentPage.querySelectorAll(".keyword-item");
      keywordItems.forEach((item, index) => {
        item.addEventListener("click", () => {
          currentKeywordIndex = index; // Aggiorna l'indice del concetto selezionato
          updateKeywordDisplay(); // Aggiorna la visualizzazione
        });
      });
    }
  }

  // Aggiorna la visualizzazione del concetto selezionato
  function updateKeywordDisplay() {
    const currentPage = pages[currentPageIndex];
    if (currentPage && data.pages[currentPageIndex - 1]?.type === "standard") {
      const keywordItems = currentPage.querySelectorAll(".keyword-item");
      const keywordImage = currentPage.querySelector(".keyword-image img");
      const keywordConcept = currentPage.querySelector(".keyword-image p");

      // Rimuovi la classe 'active' da tutti i concetti
      keywordItems.forEach((item) => item.classList.remove("active"));

      // Imposta il concetto corrente come attivo
      if (keywordItems[currentKeywordIndex]) {
        keywordItems[currentKeywordIndex].classList.add("active");
        keywordImage.src =
          data.pages[currentPageIndex - 1].keywords[currentKeywordIndex].image;
        keywordConcept.innerText =
          data.pages[currentPageIndex - 1].keywords[
            currentKeywordIndex
          ].concept;
      }
    }
  }

  // Navigazione tra i concetti (destra/sinistra)
  function navigateKeywords(direction) {
    const currentPage = pages[currentPageIndex];
    if (currentPage && data.pages[currentPageIndex - 1]?.type === "standard") {
      const totalKeywords = data.pages[currentPageIndex - 1].keywords.length;
      if (direction === "right") {
        currentKeywordIndex = (currentKeywordIndex + 1) % totalKeywords; // Passa al concetto successivo
      } else if (direction === "left") {
        currentKeywordIndex =
          (currentKeywordIndex - 1 + totalKeywords) % totalKeywords; // Passa al concetto precedente
      }
      updateKeywordDisplay(); // Aggiorna la visualizzazione
    }
  }

  // Navigazione tra le pagine (su/giù)
  function navigatePages(direction) {
    if (direction === "down") {
      if (currentPageIndex === pages.length - 1) return;

      currentPageIndex = (currentPageIndex + 1) % pages.length; // Passa alla pagina successiva
    } else if (direction === "up") {
      if (currentPageIndex === 0) return;

      currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length; // Passa alla pagina precedente
    }
    showPage(pages[currentPageIndex].id); // Mostra la nuova pagina
  }

  // Gestione degli eventi da tastiera
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      navigateKeywords("right"); // Passa al concetto successivo
    } else if (event.key === "ArrowLeft") {
      navigateKeywords("left"); // Passa al concetto precedente
    } else if (event.key === "ArrowDown") {
      navigatePages("down"); // Passa alla pagina successiva
    } else if (event.key === "ArrowUp") {
      navigatePages("up"); // Passa alla pagina precedente
    }
  });
});
