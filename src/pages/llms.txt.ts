import { getCollection } from 'astro:content';

export async function GET() {
  const courses = await getCollection('courses');
  const publications = await getCollection('publications');

  // Extract all unique tags from publications
  const publicationTags = new Set<string>();
  for (const pub of publications) {
    if (pub.data.tags) {
      pub.data.tags.forEach((tag) => publicationTags.add(tag));
    }
  }

  // Extract all unique tags from courses
  const courseTags = new Set<string>();
  for (const course of courses) {
    if (course.data.tags) {
      course.data.tags.forEach((tag) => courseTags.add(tag));
    }
  }

  let content = `# Future Edu Academy - Baza Wiedzy\n\n`;
  content += `**URL:** https://eduacademy.pl\n`;
  content += `**Opis:** Future Edu Academy to przyjazne miejsce edukacji stworzone z pasji i doświadczenia. Oferujemy profesjonalne szkolenia z podziałem na grupy docelowe: dzieci, nauczycieli i seniorów, oraz publikacje edukacyjne.\n\n`;

  content += `## Kategorie Szkoleń\n\n`;
  content += `- **Dla dzieci:** Warsztaty rozwijające kreatywność, sensorykę i umiejętności techniczne\n`;
  content += `- **Dla nauczycieli:** Szkolenia metodyczne, psychologiczne i rozwojowe\n`;
  content += `- **Dla seniorów:** Kursy cyfrowe, treningi pamięci i aktywizacja\n\n`;

  content += `## Dostępne Szkolenia\n\n`;

  for (const course of courses) {
    content += `### ${course.data.title}\n\n`;
    content += `- **URL:** https://eduacademy.pl/szkolenia/${course.id}\n`;
    content += `- **Kategoria:** ${course.data.category}\n`;
    content += `- **Cena:** ${course.data.priceFrom}\n`;
    content += `- **Tagi:** ${course.data.tags.join(', ')}\n`;

    if (course.data.image) {
      content += `- **Ikona/Obraz:** ${course.data.image}\n`;
    }

    if (course.data.pdfFile) {
      content += `- **Załącznik PDF:** ${course.data.pdfFile}\n`;
    }

    content += `- **Opis:** Szczegółowy opis programu dostępny na stronie szkolenia.\n\n`;
  }

  content += `## Tagi Szkoleń\n\n`;
  const sortedCourseTags = Array.from(courseTags).sort();
  for (const tag of sortedCourseTags) {
    const tagSlug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    content += `- **${tag}:** https://eduacademy.pl/szkolenia/tag/${tagSlug}\n`;
  }
  content += `\n`;

  content += `## Publikacje Edukacyjne\n\n`;

  for (const pub of publications) {
    content += `### ${pub.data.title}\n\n`;
    content += `- **URL:** https://eduacademy.pl/publikacje/${pub.id}\n`;
    content += `- **Data publikacji:** ${pub.data.pubDate.toISOString().split('T')[0]}\n`;

    if (pub.data.author) {
      content += `- **Autor:** ${pub.data.author}\n`;
    }

    if (pub.data.tags && pub.data.tags.length > 0) {
      content += `- **Tagi:** ${pub.data.tags.join(', ')}\n`;
    }

    if (pub.data.image) {
      content += `- **Obraz:** ${pub.data.image}\n`;
    }

    if (pub.data.pdfFile) {
      content += `- **Załącznik PDF:** ${pub.data.pdfFile}\n`;
    }

    content += `- **Opis:** ${pub.data.description}\n\n`;
  }

  content += `## Tagi Publikacji\n\n`;
  const sortedTags = Array.from(publicationTags).sort();
  for (const tag of sortedTags) {
    const tagSlug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    content += `- **${tag}:** https://eduacademy.pl/publikacje/tag/${tagSlug}\n`;
  }
  content += `\n`;

  content += `## Kontakt i Rejestracja\n\n`;
  content += `- **Strona główna:** https://eduacademy.pl\n`;
  content += `- **Kontakt:** https://eduacademy.pl/kontakt\n`;
  content += `- **O nas:** https://eduacademy.pl/o-nas\n`;
  content += `- **Publikacje:** https://eduacademy.pl/publikacje\n`;
  content += `- **Rejestracja:** Formularz kontaktowy dostępny na stronie każdego szkolenia\n\n`;
  content += `## Metodyka\n\n`;
  content += `Wszystkie szkolenia mają charakter praktyczny. Dbamy o bezpieczeństwo, indywidualne podejście i optymalne metody dla każdej grupy wiekowej. Materiały są ekologiczne i bezpieczne. Publikacje powstają z 35-letniego doświadczenia pedagogicznego.\n\n`;
  content += `---\n`;
  content += `*Wygenerowano automatycznie przez Future Edu Academy*`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
