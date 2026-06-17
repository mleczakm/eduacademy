import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'mleczakm/eduacademy',
  },
  collections: {
    courses: collection({
      label: 'Szkolenia',
      slugField: 'title',
      path: 'src/content/courses/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Tytuł szkolenia' } }),
        category: fields.select({
          label: 'Kategoria',
          options: [
            { label: 'Dla dzieci', value: 'dzieci' },
            { label: 'Dla nauczycieli', value: 'nauczyciele' },
            { label: 'Dla seniorów', value: 'seniorzy' },
          ],
          defaultValue: 'dzieci',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tagi',
          itemLabel: (props) => props.value,
        }),
        priceFrom: fields.text({ label: 'Cena od' }),
        image: fields.image({
          label: 'Zdjęcie wyróżniające',
          directory: 'public/assets',
          publicPath: '/assets/',
        }),
        content: fields.markdoc({ label: 'Pełny opis programu' }),
      },
    }),

    publications: collection({
      label: 'Publikacje',
      slugField: 'title',
      path: 'src/content/publications/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Tytuł' } }),
        date: fields.datetime({
          label: 'Data',
          validation: { isRequired: true },
        }),
        content: fields.markdoc({ label: 'Treść' }),
      },
    }),

    pages: collection({
      label: 'Strony Informacyjne',
      path: 'src/content/pages',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({
          label: 'Tytuł strony',
          validation: { isRequired: true },
        }),
        slug: fields.text({
          label: 'Slug (URL)',
          validation: { isRequired: true },
        }),
        content: fields.markdoc({
          label: 'Treść',
        }),
      },
      entryLayout: 'content',
    }),
  },
});
