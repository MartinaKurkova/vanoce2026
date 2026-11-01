# Vánoční přání

Stránka se seznamem dárků. Prarodiče na ni kliknou z odkazu, napíšou své jméno a zarezervují dárek. Žádná registrace není potřeba.

## Co kde je

- `public/index.html` je celá stránka, na ní nic měnit nemusíš.
- `public/gifts.json` je seznam dárků. Sem se vkládá tvůj JSON.
- `public/img/` je složka pro fotky dárků.
- `netlify/functions/reservations.mjs` ukládá rezervace na Netlify.

## Jak to nasadit

1. Do `public/img/` dej fotky dárků a do `public/gifts.json` napiš jejich cesty, například `"image": "img/lego.jpg"`.
2. Celou složku nahraj do nového repozitáře na GitHubu.
3. V Netlify klikni na Add new site, Import an existing project a vyber ten repozitář. Nic dalšího nastavovat nemusíš.
4. Po nasazení pošli prarodičům odkaz na novou stránku.

## Jak vypadá jeden dárek v gifts.json

```json
{
  "id": "lego-1",
  "name": "Název dárku",
  "price": 890,
  "for": "Pro koho",
  "image": "img/lego.jpg",
  "heureka": "https://www.heureka.cz/…"
}
```

`id` musí být u každého dárku jiné (jen písmena bez diakritiky, čísla, pomlčka). Po poslání odkazu už ho neměň, drží se na něm rezervace. Cenu můžeš napsat číslem (zobrazí se jako „cca 890 Kč“) nebo textem.

## Jak zrušit cizí rezervaci

Každý si zruší svou rezervaci sám ze stejného telefonu nebo počítače. Chceš-li smazat nějakou ty, v Netlify otevři svůj web, v levém menu Blobs, úložiště `rezervace`, a smaž položku `r/` s id dárku.

## Zkouška doma

V této složce spusť `npm install` a potom `npx netlify dev`. Stránka poběží na adrese, kterou příkaz vypíše.
