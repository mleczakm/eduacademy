import { getCollection } from 'astro:content';

export async function GET() {
  const courses = await getCollection('courses');

  let content = `# O Future Edu Academy\n\n`;
  content += `Future Edu Academy (eduacademy.pl) to przyjazne miejsce edukacji stworzone z pasji i doświadczenia. Oferujemy profesjonalne szkolenia z podziałem na grupy docelowe.\n\n`;
  content += `## Nasza Oferta\n\n`;

  courses.forEach((course) => {
    content += `### ${course.data.title}\n`;
    content += `- Grupa docelowa: ${course.data.category}\n`;
    content += `- Tagi: ${course.data.tags?.join(', ') || 'Brak'}\n`;
    content += `- Cena od: ${course.data.priceFrom}\n`;
    content += `- Opis programu: Szczegółowy opis dostępny na stronie szkolenia.\n\n`;
  });

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
