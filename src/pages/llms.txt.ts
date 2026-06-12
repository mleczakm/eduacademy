import { getCollection } from 'astro:content';

export async function GET() {
  const courses = await getCollection('courses');

  let content = `# Future Edu Academy - Baza Wiedzy o Szkoleniach\n\n`;
  content += `**URL:** https://eduacademy.pl\n`;
  content += `**Opis:** Future Edu Academy to przyjazne miejsce edukacji stworzone z pasji i doświadczenia. Oferujemy profesjonalne szkolenia z podziałem na grupy docelowe: dzieci, nauczycieli i seniorów.\n\n`;
  content += `## Kategorie Szkoleń\n\n`;
  content += `- **Dla dzieci:** Warsztaty rozwijające kreatywność, sensorykę i umiejętności techniczne\n`;
  content += `- **Dla nauczycieli:** Szkolenia metodyczne, psychologiczne i rozwojowe\n`;
  content += `- **Dla seniorów:** Kursy cyfrowe, treningi pamięci i aktywizacja\n\n`;
  content += `## Dostępne Szkolenia\n\n`;

  for (const course of courses) {
    content += `### ${course.data.title}\n\n`;
    content += `- **URL:** https://eduacademy.pl/szkolenia/${course.slug}\n`;
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

  content += `## Kontakt i Rejestracja\n\n`;
  content += `- **Strona główna:** https://eduacademy.pl\n`;
  content += `- **Kontakt:** https://eduacademy.pl/kontakt\n`;
  content += `- **O nas:** https://eduacademy.pl/o-nas\n`;
  content += `- **Rejestracja:** Formularz kontaktowy dostępny na stronie każdego szkolenia\n\n`;
  content += `## Metodyka\n\n`;
  content += `Wszystkie szkolenia mają charakter praktyczny. Dbamy o bezpieczeństwo, indywidualne podejście i optymalne metody dla każdej grupy wiekowej. Materiały są ekologiczne i bezpieczne.\n\n`;
  content += `---\n`;
  content += `*Wygenerowano automatycznie przez Future Edu Academy*`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
