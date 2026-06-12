Architektura Jamstack: Future Edu Academy (Astro + Decap CMS)

Ten dokument to kompletny blueprint dla statycznej strony edukacyjnej Future Edu Academy, zbudowanej z użyciem Astro (Static Site Generator), Tailwind CSS (stylistyka pastelowa/miękka) oraz Decap CMS (Headless CMS oparty na Git). Wdrożono tu również integrację z Formspree (zapisy) oraz innowacyjne wsparcie dla AI (window.ai oraz llms.txt).

1. Struktura Projektu (Astro)

Astro idealnie współpracuje z Decap CMS dzięki tzw. Content Collections, pozwalając na w pełni typowane i bezpieczne generowanie statycznego HTML z plików Markdown.

future-edu-academy/
├── public/
│ ├── admin/
│ │ ├── index.html # Inicjalizacja Decap CMS
│ │ └── config.yml # Konfiguracja pól Decap CMS
│ └── assets/ # Uploadowane grafiki i PDF-y z CMS
├── src/
│ ├── components/
│ │ ├── HeroAI.astro # Czatbot oparty na window.ai
│ │ ├── CourseCard.astro # Komponent karty kursu
│ │ └── FormspreeModal.astro # Modal z formularzem zapisów
│ ├── content/
│ │ ├── config.ts # Schematy Zod dla Markdowna
│ │ └── courses/ # Tutaj CMS zapisuje pliki .md kursów
│ ├── pages/
│ │ ├── index.astro # Strona główna
│ │ ├── szkolenia/
│ │ │ └── [slug].astro # Dynamiczny szablon pojedynczego szkolenia
│ │ ├── sitemap-index.xml # (Generowane przez integrację Astro)
│ │ └── llms.txt.ts # Endpoint generujący plik llms.txt
│ └── styles/
│ └── global.css # Tailwind + Font Quicksand
├── astro.config.mjs # Konfiguracja Astro
└── package.json

2. Konfiguracja Decap CMS (public/admin/config.yml)

Ten plik zapewnia nietechnicznemu klientowi piękny, przeglądarkowy panel do zarządzania treściami, z uwzględnieniem tagów, załączników PDF i kategorii.

backend:
name: github
repo: twoj-uzytkownik/future-edu-academy
branch: main

media_folder: "public/assets"
public_folder: "/assets"

collections:

# 1. SZKOLENIA (Katalog)

- name: "courses"
  label: "Szkolenia"
  folder: "src/content/courses"
  create: true
  slug: "{{year}}-{{month}}-{{slug}}"
  fields:
  - { label: "Tytuł szkolenia", name: "title", widget: "string" }
  - { label: "Kategoria docelowa", name: "category", widget: "select", options: ["Dla dzieci", "Dla nauczycieli", "Dla seniorów"] }
  - { label: "Tagi (oddzielone przecinkiem)", name: "tags", widget: "list" }
  - { label: "Cena od (np. 120 zł)", name: "priceFrom", widget: "string" }
  - { label: "Zdjęcie wyróżniające", name: "image", widget: "image", required: false }
  - { label: "Załącznik PDF (np. program)", name: "pdfFile", widget: "file", required: false }
  - { label: "Pełny opis programu", name: "body", widget: "markdown" }

# 2. PUBLIKACJE (Artykuły)

- name: "publications"
  label: "Publikacje"
  folder: "src/content/publications"
  create: true
  fields:
  - { label: "Tytuł", name: "title", widget: "string" }
  - { label: "Data", name: "date", widget: "datetime" }
  - { label: "Treść", name: "body", widget: "markdown" }

# 3. STRONY STATYCZNE (O nas, Dla rodzica)

- name: "pages"
  label: "Strony Informacyjne"
  files:
  - file: "src/content/pages/about.md"
    label: "O mnie / Kadra"
    name: "about"
    fields:
    - { label: "Tytuł strony", name: "title", widget: "string" }
    - { label: "Treść", name: "body", widget: "markdown" }
  - file: "src/content/pages/parents.md"
    label: "Dla rodzica"
    name: "parents"
    fields:
    - { label: "Tytuł strony", name: "title", widget: "string" }
    - { label: "Treść", name: "body", widget: "markdown" }

3. Kluczowe Komponenty Systemu (Astro + UI/UX)

Stylistyka używa klasycznych dla "pastelowego" UI klas Tailwind: rounded-3xl, bg-teal-50, text-slate-800 oraz fontu Quicksand.

A. Moduł Zapisów i Formspree (FormspreeModal.astro)

Zero backendu, solidna dostarczalność wiadomości.

---

// Zmienne przekazywane do komponentu
const { courseTitle } = Astro.props;

---

<div id="enroll-modal" class="hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
  <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
    <h3 class="text-2xl font-bold text-slate-800 mb-4 font-quicksand">Zapisz się na zajęcia</h3>

    <!-- Integracja Formspree -->
    <form action="[https://formspree.io/f/TWOJ_ID_FORMSPREE](https://formspree.io/f/TWOJ_ID_FORMSPREE)" method="POST" class="space-y-4">
      <!-- Ukryte pole z nazwą kursu (automatyczne przypisanie) -->
      <input type="hidden" name="Szkolenie" value={courseTitle} />

      <div>
        <label class="block text-sm font-bold text-slate-600 mb-1">Imię i nazwisko</label>
        <input type="text" name="name" required class="w-full bg-stone-50 border-2 border-teal-50 rounded-2xl px-4 py-3 focus:outline-none focus:border-teal-400">
      </div>
      <div>
        <label class="block text-sm font-bold text-slate-600 mb-1">Adres E-mail</label>
        <input type="email" name="email" required class="w-full bg-stone-50 border-2 border-teal-50 rounded-2xl px-4 py-3 focus:outline-none focus:border-teal-400">
      </div>
      <div>
        <label class="block text-sm font-bold text-slate-600 mb-1">Wiadomość / Pytania</label>
        <textarea name="message" rows="3" class="w-full bg-stone-50 border-2 border-teal-50 rounded-2xl px-4 py-3 focus:outline-none focus:border-teal-400"></textarea>
      </div>

      <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-2xl transition shadow-md">
        Wyślij zgłoszenie
      </button>
    </form>
    <button onclick="document.getElementById('enroll-modal').classList.add('hidden')" class="mt-4 text-slate-400 hover:text-slate-600 text-sm font-bold w-full text-center">
      Anuluj
    </button>

  </div>
</div>

B. Innowacyjny Czat AI Chrome (HeroAI.astro)

Wykorzystuje lokalne modele AI przeglądarki Chrome (API window.ai.languageModel), zapewniając prywatność i zerowe koszty serwerowe.

<section class="bg-gradient-to-b from-teal-50/50 to-white py-20 rounded-b-[3rem]">
  <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
    <div>
      <h1 class="text-5xl font-extrabold text-slate-800 font-quicksand mb-6">Witamy w <span class="text-teal-600">Future Edu Academy</span></h1>
      <p class="text-xl text-slate-600 mb-8">Z ciepłem i doświadczeniem wspieramy rozwój dzieci, nauczycieli i seniorów.</p>
    </div>

    <!-- Moduł Asystenta -->
    <div class="bg-white p-6 rounded-3xl shadow-xl border border-teal-100">
      <div class="flex items-center gap-3 mb-4">
        <span class="text-3xl">🐨</span>
        <h3 class="font-bold text-slate-800">Wirtualny Doradca (Local AI)</h3>
      </div>
      <div id="chat-output" class="h-48 overflow-y-auto bg-stone-50 rounded-2xl p-4 mb-4 text-sm text-slate-600 space-y-3">
        <p>Cześć! Opowiedz mi krótko, dla kogo szukasz zajęć, a doradzę Ci najlepszą opcję z naszej oferty.</p>
      </div>
      <div class="flex gap-2">
        <input type="text" id="ai-input" placeholder="Np. szukam zajęć dla 5 latka..." class="flex-grow bg-stone-50 border border-teal-100 rounded-2xl px-4 py-2 focus:outline-none">
        <button id="ai-submit" class="bg-teal-600 text-white px-4 py-2 rounded-2xl font-bold">Wyślij</button>
      </div>
    </div>

  </div>
</section>

<script>
  // Logika Chrome window.ai
  document.getElementById('ai-submit').addEventListener('click', async () => {
    const input = document.getElementById('ai-input');
    const output = document.getElementById('chat-output');
    const userText = input.value;
    if (!userText) return;

    // Wyświetl wiadomość usera
    output.innerHTML += `<p class="text-right"><span class="bg-teal-100 px-3 py-1 rounded-xl inline-block">${userText}</span></p>`;
    input.value = '';

    try {
      if ('ai' in window && 'languageModel' in window.ai) {
        // Inicjalizacja lokalnego modelu przeglądarki Chrome
        const session = await window.ai.languageModel.create({
          systemPrompt: "Jesteś ciepłym asystentem Future Edu Academy. Mamy szkolenia dla dzieci (np. sensoryka), nauczycieli (metodyka) i seniorów (trening pamięci). Odpowiadaj maksymalnie w 2 zdaniach, sympatycznym tonem."
        });
        const response = await session.prompt(userText);
        
        output.innerHTML += `<p class="text-left"><span class="bg-white border px-3 py-1 rounded-xl inline-block">${response}</span></p>`;
      } else {
        output.innerHTML += `<p class="text-left text-amber-600"><em>Twój przeglądarka nie obsługuje jeszcze wbudowanego AI (window.ai). Przejrzyj nasz katalog!</em></p>`;
      }
    } catch (e) {
      console.error(e);
      output.innerHTML += `<p class="text-left text-red-500"><em>Błąd połączenia z modelem.</em></p>`;
    }
    output.scrollTop = output.scrollHeight;
  });
</script>

4. Konfiguracja SEO i plików dla LLM (Astro)

Sitemap (w astro.config.mjs)

Używamy oficjalnej integracji Astro, by budować poprawną strukturę dla Google.

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
site: '[https://eduacademy.pl](https://eduacademy.pl)',
integrations: [tailwind(), sitemap()],
});

Plik dla AI Agnetów (src/pages/llms.txt.ts)

Zgodnie ze standardem LLMs.txt, tworzymy endpoint, który podczas budowania strony agreguje opisy wszystkich szkoleń do jednego pliku tekstowego, aby zewnętrzne modele AI (jak ChatGPT czy Claude) mogły idealnie odczytać ofertę Akademii.

import { getCollection } from 'astro:content';

export async function GET() {
const courses = await getCollection('courses');

let content = `# O Future Edu Academy\n\n`;
content += `Future Edu Academy (eduacademy.pl) to przyjazne miejsce edukacji stworzone z pasji i doświadczenia. Oferujemy profesjonalne szkolenia z podziałem na grupy docelowe.\n\n`;
content += `## Nasza Oferta\n\n`;

courses.forEach(course => {
content += `### ${course.data.title}\n`;
content += `- Grupa docelowa: ${course.data.category}\n`;
content += `- Tagi: ${course.data.tags?.join(', ')}\n`;
content += `- Cena od: ${course.data.priceFrom}\n`;
content += `- Opis programu: ${course.body}\n\n`;
});

return new Response(content, {
headers: {
'Content-Type': 'text/plain; charset=utf-8',
'Cache-Control': 'public, max-age=3600'
}
});
}

5. Instrukcja Wdrożenia (GitHub Pages)

Astro natywnie kompiluje wszystko do czystego HTML/CSS/JS (tzw. folder dist).

GitHub Actions: W repozytorium GitHub dodaj plik .github/workflows/deploy.yml:

name: Deploy Astro to GitHub Pages
on:
push:
branches: [main]
permissions:
contents: read
pages: write
id-token: write
jobs:
build:
runs-on: ubuntu-latest
steps:

- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with: { node-version: 20 }
- run: npm install
- run: npm run build
- uses: actions/upload-pages-artifact@v3
  with: { path: './dist' }
  deploy:
  needs: build
  runs-on: ubuntu-latest
  environment:
  name: github-pages
  steps:
- uses: actions/deploy-pages@v4

Logowanie do Decap CMS:
Aby klient mógł się logować bez zakładania konta na Netlify, autoryzuj CMS używając Decap CMS OAuth Server lub dodaj darmową integrację GitHub App. Dzięki temu wejście na eduacademy.pl/admin wyświetli bezpieczny panel logowania do GitHub.
